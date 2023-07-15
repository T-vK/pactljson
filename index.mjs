import { exec } from 'child_process';

function parseInfo(infoStr) {
    const keyValuePairs = infoStr.split(',').map(pair => pair.trim());
    const info = {};
  
    for (const pair of keyValuePairs) {
        const [key, value] = pair.split(':').map(item => item.trim());

        if (key === 'available') {
            info['available'] = 'yes'
        } else if (key === 'availability unknown') {
            info['available'] = 'unknown'
        } else if (key === 'not available') {
            info['available'] = 'no'
        } else if (key === 'latency offset') {
            info['latency offset'] = value.split(' ')[0];
        } else {
            info[key] = isNaN(value) ? value : Number(value);
        }
    }
  
    return info;
}

function convertPactlFormatStringToObject(inputString) {
    const output = {};
    
    // Step 1: Extract the type
    const type = inputString.substring(0, inputString.indexOf(',')).trim();
    output.type = type;
    
    // Step 2: Find key-value pairs using regex
    const regex = /([\w\.]+) = "(.+?)"(?:  |$)/g;
    let match;
    while ((match = regex.exec(inputString)) !== null) {
      const key = match[1];
      let value = match[2];
      
      // Step 3: Remove occurrences of \"
      value = value.replace(/\\"/g, '');
  
      // Step 4: Set key-value pair on the output object
      output[key] = isNaN(value) ? value : Number(value);
    }
  
    return output;
  }

function pactlSampleStringToObject(sampleString) {
    const [, formatName, dataType, sampleSize, endianess, channelCount, samplingRate] = sampleString.match(/((s|u|f|float)(\d+)(le|be)) (\d)+ch (\d+)Hz/);
    return {
        name: formatName,
        sampleSize: parseInt(sampleSize),
        samplingRate: parseInt(samplingRate),
        endianess: endianess === 'le' ? 'Little' : 'Big',
        dataType: dataType === 's' ? 'Signed Integer' : (dataType === 'u' ? 'Unsigned Integer' : 'Float'),
        channelCount: parseInt(channelCount)
    };
}

function pactlVolumeStringToObject(volumeString) {
    const [raw, percent, decibels] = volumeString.split(" / ");
    return {
        raw: parseInt(raw),
        percent: parseInt(percent.replace("%", "")),
        decibels: decibels === '-inf dB' ? '-inf' : parseFloat(decibels.replace(" dB", ""))
    };
}

export function rawPactlToObj(rawPactlOutput) {
    const lines = rawPactlOutput.split("\n");
    const output = {};
    let propStack = [output];
    for (let lineIndex = 0; lineIndex <= lines.length - 1; lineIndex++) {
        const line = lines[lineIndex];
        if (line === '') {
            continue
        }

        const indentLvl = line.match(/^\s*/)[0].length;
        const trimmedLine = line.trim();

        const nextLine = lines[lineIndex+1];
        const prevLine = lines[lineIndex-1];
        const nextLineIndentLvl = nextLine !== undefined ? nextLine.match(/^\s*/)[0].length : null;
        const nextLineTrimmed = nextLine !== undefined ? nextLine.trim() : null;
        const prevLineIndentLvl = prevLine !== undefined ? prevLine.match(/^\s*/)[0].length : null;
        const prevLineTrimmed = prevLine !== undefined ? prevLine.trim() : null;

        if (indentLvl < propStack.length-1) {
            const indentLvlDiff = propStack.length-1-indentLvl;
            for (let i=0; i<indentLvlDiff; i++) {
                propStack.pop();
            }
        }

        /*if (indentLvl < prevIndentLvl) {
            const indentLvlDiff = prevIndentLvl-indentLvl;
            for (let i=0; i<indentLvlDiff; i++) {
                propStack.pop();
            }
        }*/
        if ((indentLvl === 0 && trimmedLine.includes('#') && !trimmedLine.includes(':')) || trimmedLine.endsWith(':')) {
            const propName = trimmedLine.replace(/:$/, '');
            const currentProp = propStack[propStack.length-1];
            
            if (nextLineTrimmed === 'pcm' || !nextLineTrimmed) {
                currentProp[propName] = [nextLineTrimmed];
                lineIndex++;
            } else {
                currentProp[propName] = {};
            }

            propStack.push(currentProp[propName]);
        } else {
            const propName = trimmedLine.split(/(: | = )/)[0];
            //const rawPropName = trimmedLine.split(/(: | = )/)[0];
            //const propNamePrefix = (rawPropName.match(/^\[(.*?)\]\s/) || [])[1] || '';
            //const propName = rawPropName.replace(/^\[.*?\]\s/, '');
            const rawPropValue = (trimmedLine.match(/(: | = )(.+$)/) || [''])[2];
            let propValue = {};
            if (rawPropValue !== undefined) {
                const propValueTemp = rawPropValue.replace(/^"(.*)"$/, '$1');
                //const match = propValueTemp.match(/^([\w\s]+)(?: \(([^)]+)\))?$/);
                const [, value, rawInfo] = propValueTemp.match(/^(.*?)(?:\s*\(([^)]*)\))?\s*$/).map((s) => (s ? s.trim() : null));
                const info = rawInfo !== null && rawInfo ? parseInfo(rawInfo) : null;
                
                if (propName === 'Argument' && rawPropValue === '{') {
                    lineIndex++;
                    let argumentString = '';
                    while (lines[lineIndex].startsWith('            ')) {
                        argumentString += lines[lineIndex].replace(/^        /, '') + `\n`;
                        lineIndex++;
                    }
                    lineIndex++;
                    propValue = `{\n${argumentString}}`;
                } else if (value === null) {
                    propValue = '';
                } else if (info !== null) {
                    if (propName === 'Server Name') {
                        propValue = propValueTemp;
                    } else {
                        propValue = { name: value, info };
                    }
                } else if (value.includes(',') && !value.includes(':')) { // audio.position = "FL,FR,RL,RR" || Channel Map: front-left,front-right,rear-left,rear-right
                    if (propName === 'Latency') {
                        const [actual, configured] = value.match(/\d+/g).map(Number);
                        propValue = { actual, configured };
                    } else if (propName === 'Format') {
                        propValue = convertPactlFormatStringToObject(value);
                    } else if (propName === 'module.description') {
                        propValue = value;
                    } else {
                        propValue = value.split(',').map(str => str.trim());
                    }
                } else if (value.includes(', ') && value.includes(': ')) {
                    if (propName.endsWith('Volume')) {
                        propValue = {channels: {}};
                        const parsedInfo = parseInfo(value);
                        for (const key in parsedInfo) {
                            if (parsedInfo.hasOwnProperty(key)) {
                                propValue.channels[key] = pactlVolumeStringToObject(parsedInfo[key]);
                            }
                        }
                        if (nextLineTrimmed.startsWith('balance ')) {
                            propValue.balance = nextLineTrimmed.split(' ')[1];
                            lineIndex++;
                        }
                    }
                } else if (value.includes(', ') && !value.includes(': ')) {
                    if (propName === 'Part of profile(s)') {
                        propValue = value.split(',').map(str => str.trim());
                    } else {
                        propValue = value;
                    }
                } else if (/^[A-Z_ ]+$/.test(value) && propName.includes('Flags')) {
                    propValue = value.split(' ').map(str => str.trim());
                } else {
                    if (propName.endsWith('Sample Specification')) {
                        propValue = pactlSampleStringToObject(value);
                    } else if (propName.endsWith('Volume')) {
                        propValue = pactlVolumeStringToObject(value);
                    } else {
                        propValue = value;
                    }
                }
            }
            const currentProp = propStack[propStack.length-1];
            currentProp[propName] = propValue;
            /*if (propNamePrefix !== "") {
                currentProp[propName].type = propNamePrefix;
            }*/
            if (typeof currentProp[propName] === 'object') {
                propStack.push(currentProp[propName]);
            }
        }
    }
    return output;
}

export async function _pactlRaw(args=[]) {
    return new Promise((resolve, reject) => {
        exec(`pactl ${args.join(' ')}`, (err, stdout, stderr) => {
            err === null ? resolve(stdout) : reject(stderr);
        });
    });
}

export async function _pactlObj(args=[]) {
    return rawPactlToObj(await _pactlRaw(args));
}

export async function pactl({server, clientName, args = [] } = {}) {
    const options = [];
    if (server) {
        options.push(`--server=${server}`);
    }
    if (clientName) {
        options.push(`--client-name=${clientName}`);
    }
    return await _pactlObj([...options, ...args]);
}


export async function stat({ server, clientName } = {}) {
    return await pactl({ server, clientName, args: ['stat'] });
}
export async function info({ server, clientName } = {}) {
    return await pactl({ server, clientName, args: ['info'] });
}
export async function list({ server, clientName, short, type } = {}) {
    // `type` is optional and can be one of: modules, sinks, sources, sink-inputs, source-outputs, clients, samples, cards, message-handlers
    const args = ['list'];
    if (short) {
        args.push('short');
    }
    if (type) {
        args.push(type);
    }
    return await pactl({ server, clientName, args });
}
export async function exit({ server, clientName } = {}) {
    return await pactl({ server, clientName, args: ['exit'] });
}
export async function uploadSample({ server, clientName, filename, name } = {}) {
    const args = ['upload-sample', filename];
    if (name) {
        args.push(name);
    }
    return await pactl({ server, clientName, args });
}
export async function playSample({ server, clientName, name, sink } = {}) {
    const args = ['play-sample', name];
    if (sink) {
        args.push(sink);
    }
    return await pactl({ server, clientName, args });
}
export async function removeSample({ server, clientName, name } = {}) {
    const args = ['remove-sample', name];
    return await pactl({ server, clientName, args });
}
export async function loadModule({ server, clientName, name, args = [] } = {}) {
    return await pactl({ server, clientName, args: ['load-module', name, ...args] });
}
export async function unloadModule({ server, clientName, name, n } = {}) {
    return await pactl({ server, clientName, args: ['unload-module', name || n] });
}
export async function moveSinkInput({ server, clientName, n, sink } = {}) {
    return await pactl({ server, clientName, args: ['move-sink-input', n, sink] });
}
export async function moveSourceOutput({ server, clientName, n, source } = {}) {
    return await pactl({ server, clientName, args: ['move-source-output', n, source] });
}
export async function suspendSink({ server, clientName, name, n, state } = {}) {
    return await pactl({ server, clientName, args: ['suspend-sink', name || n, state] });
}
export async function suspendSource({ server, clientName, name, n, state } = {}) {
    return await pactl({ server, clientName, args: ['suspend-source', name || n, state] });
}
export async function setCardProfile({ server, clientName, card, profile } = {}) {
    return await pactl({ server, clientName, args: ['set-card-profile', card, profile] });
}
export async function getDefaultSink({ server, clientName } = {}) {
    return await pactl({ server, clientName, args: ['get-default-sink'] });
}
export async function getDefaultSource({ server, clientName } = {}) {
    return await pactl({ server, clientName, args: ['get-default-source'] });
}
export async function setDefaultSink({ server, clientName, name } = {}) {
    return await pactl({ server, clientName, args: ['set-default-sink', name] });
}
export async function setDefaultSource({ server, clientName, name } = {}) {
    return await pactl({ server, clientName, args: ['set-default-source', name] });
}
export async function setSinkPort({ server, clientName, name, n, port } = {}) {
    return await pactl({ server, clientName, args: ['set-sink-port', name || n, port] });
}
export async function setSourcePort({ server, clientName, name, n, port } = {}) {
    return await pactl({ server, clientName, args: ['set-source-port', name || n, port] });
}
export async function getSinkVolume({ server, clientName, name, n } = {}) {
    return await pactl({ server, clientName, args: ['get-sink-volume', name || n] });
}
export async function getSourceVolume({ server, clientName, name, n } = {}) {
    return await pactl({ server, clientName, args: ['get-source-volume', name || n] });
}
export async function getSinkMute({ server, clientName, name, n } = {}) {
    return await pactl({ server, clientName, args: ['get-sink-mute', name || n] });
}
export async function getSourceMute({ server, clientName, name, n } = {}) {
    return await pactl({ server, clientName, args: ['get-source-mute', name || n] });
}
export async function setSinkVolume({ server, clientName, name, n, volume, volumes = [] } = {}) {
    return await pactl({ server, clientName, args: ['set-sink-volume', name || n, volume, ...volumes] });
}
export async function setSourceVolume({ server, clientName, name, n, volume, volumes = [] } = {}) {
    return await pactl({ server, clientName, args: ['set-source-volume', name || n, volume, ...volumes] });
}
export async function setSinkInputVolume({ server, clientName, name, n, volume, volumes = [] } = {}) {
    return await pactl({ server, clientName, args: ['set-sink-input-volume', name || n, volume, ...volumes] });
}
export async function setSourceOutputVolume({ server, clientName, name, n, volume, volumes = [] } = {}) {
    return await pactl({ server, clientName, args: ['set-source-output-volume', name || n, volume, ...volumes] });
}
export async function setSinkMute({ server, clientName, name, n, state } = {}) {
    return await pactl({ server, clientName, args: ['set-sink-mute', name || n, state] });
}
export async function setSourceMute({ server, clientName, name, n, state } = {}) {
    return await pactl({ server, clientName, args: ['set-source-mute', name || n, state] });
}
export async function setSinkInputMute({ server, clientName, n, state } = {}) {
    return await pactl({ server, clientName, args: ['set-sink-input-mute', n, state] });
}
export async function setSourceOutputMute({ server, clientName, n, state } = {}) {
    return await pactl({ server, clientName, args: ['set-source-output-mute', n, state] });
}
export async function setSinkFormats({ server, clientName, n, formats } = {}) {
    return await pactl({ server, clientName, args: ['set-sink-formats', n, formats] });
}
export async function setPortLatencyOffset({ server, clientName, cardName, cardN, port, offset } = {}) {
    return await pactl({ server, clientName, args: ['set-port-latency-offset', cardName || cardN, port, offset] });
}
export async function sendMessage({ server, clientName, recipient, message, messageParameters } = {}) {
    const args = ['send-message', recipient, message];
    if (messageParameters) {
        args.push(messageParameters);
    }
    return await pactl({ server, clientName, args });
}
export async function subscribe({ server, clientName } = {}) {
    return await pactl({ server, clientName, args: ['subscribe'] });
}