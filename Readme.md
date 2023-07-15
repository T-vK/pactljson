## Description
This is a wrapper cli and library for `pactl`. It's main purpose is to provide a reasonable JSON output format.

## Known issues
- `module.value` in the output of `pactl list modules` is kept as a string because I had no good idea for a JSON representation:
    ```
    module.value: "[nice.level=<priority: default 20(don't change)>] [rt.prio=<priority: default 88>] [rt.time.soft=<in usec: default -1] [rt.time.hard=<in usec: default -1]"
    ```
- I have only tested `list`, `info` and `stat`
  All the other methods are implemented and probably work, but the output might not be formatted in a way that makes sense
  For list I have verified all possible types: modules, sinks, sources, sink-inputs, source-outputs, clients, samples, cards, message-handler

## CLI usage exapmles
Install via `npm i -g pactljson`, then use it exactly like pactl. E.g. to get all sound cards in JSON format:
``` Bash
pactljson list cards
```

## Code usage Examples
``` JavaScript
import { info } from 'pactljson';

async function main() {
    const infoObj = await info();
    const infoJson = JSON.stringify(infoObj, null, '  ');
    console.log(infoJson);
}

main().catch(console.error);
```

``` JavaScript
import { list } from 'pactljson';

async function main() {
    const sourcesObj = await list({type: 'sources'});
    const sourcesJson = JSON.stringify(sourcesObj, null, '  ');
    console.log(sourcesJson);

    const cardsObj = await list({type: 'cards'});
    const cardsJson = JSON.stringify(cardsObj, null, '  ');
    console.log(cardsJson);
}

main().catch(console.error);
```

``` JavaScript
import { setCardProfile } from 'pactljson';

async function main() {
    try {
        await setCardProfile({card: 1, profile: 'output:analog-stereo'});
        console.log('Card profile set successfully');
    } catch (e) {
        console.error(e);
    }
}

main().catch(console.error);
```

## Available methods
``` JavaScript
async function stat({ server, clientName })
async function info({ server, clientName })
async function list({ server, clientName, short, type })
async function exit({ server, clientName })
async function uploadSample({ server, clientName, filename, name })
async function playSample({ server, clientName, name, sink })
async function removeSample({ server, clientName, name })
async function loadModule({ server, clientName, name, args = [] })
async function unloadModule({ server, clientName, name, n })
async function moveSinkInput({ server, clientName, n, sink })
async function moveSourceOutput({ server, clientName, n, source })
async function suspendSink({ server, clientName, name, n, state })
async function suspendSource({ server, clientName, name, n, state })
async function setCardProfile({ server, clientName, card, profile })
async function getDefaultSink({ server, clientName })
async function getDefaultSource({ server, clientName })
async function setDefaultSink({ server, clientName, name })
async function setDefaultSource({ server, clientName, name })
async function setSinkPort({ server, clientName, name, n, port })
async function setSourcePort({ server, clientName, name, n, port })
async function getSinkVolume({ server, clientName, name, n })
async function getSourceVolume({ server, clientName, name, n })
async function getSinkMute({ server, clientName, name, n })
async function getSourceMute({ server, clientName, name, n })
async function setSinkVolume({ server, clientName, name, n, volume, volumes = [] })
async function setSourceVolume({ server, clientName, name, n, volume, volumes = [] })
async function setSinkInputVolume({ server, clientName, name, n, volume, volumes = [] })
async function setSourceOutputVolume({ server, clientName, name, n, volume, volumes = [] })
async function setSinkMute({ server, clientName, name, n, state })
async function setSourceMute({ server, clientName, name, n, state })
async function setSinkInputMute({ server, clientName, n, state })
async function setSourceOutputMute({ server, clientName, n, state })
async function setSinkFormats({ server, clientName, n, formats })
async function setPortLatencyOffset({ server, clientName, cardName, cardN, port, offset })
async function sendMessage({ server, clientName, recipient, message, messageParameters })
async function subscribe({ server, clientName })

// You can also use any of these for more direct pactl access, e.g. in case pactl implements new methods that this library doesn't support yet:
async function _pactlRaw(args=[])
async function _pactlObj(args=[])
async function pactl({server, clientName, args = [] })
function rawPactlToObj(rawPactlOutput)
```

## Example outputs
Example output of `await info();` and `pactljson info`:
``` JSON
{
  "Server String": "/run/user/1000/pulse/native",
  "Library Protocol Version": "35",
  "Server Protocol Version": "35",
  "Is Local": "yes",
  "Client Index": "990",
  "Tile Size": "65472",
  "User Name": "fedora",
  "Host Name": "fedora",
  "Server Name": "PulseAudio (on PipeWire 0.3.56)",
  "Server Version": "15.0.0",
  "Default Sample Specification": {
    "name": "float32le",
    "sampleSize": 32,
    "samplingRate": 48000,
    "endianess": "Little",
    "dataType": "Float",
    "channelCount": 2
  },
  "Default Channel Map": [
    "front-left",
    "front-right"
  ],
  "Default Sink": "alsa_output.pci-0000_00_1f.3.analog-stereo",
  "Default Source": "alsa_output.pci-0000_00_1f.3.analog-stereo.monitor",
  "Cookie": "81ed:b81d"
}
```

Example output of `await list({type: 'cards'});` and `pactljson list cards`:
``` JSON
{
  "Card #40": {
    "Name": "alsa_card.pci-0000_00_1f.3",
    "Driver": "alsa",
    "Owner Module": "n/a",
    "Properties": {
      "device.enum.api": "udev",
      "device.api": "alsa",
      "media.class": "Audio/Device",
      "api.alsa.path": "hw:0",
      "api.alsa.card": "0",
      "api.alsa.card.name": "HDA Intel PCH",
      "api.alsa.card.longname": "HDA Intel PCH at 0xec510000 irq 153",
      "device.plugged.usec": "22073351",
      "device.bus_path": "pci-0000:00:1f.3",
      "sysfs.path": "/sys/devices/pci0000:00/0000:00:1f.3/sound/card0",
      "device.bus": "pci",
      "device.subsystem": "sound",
      "device.vendor.id": "0x8086",
      "device.vendor.name": "Intel Corporation",
      "device.product.id": "0xa171",
      "device.product.name": "CM238 HD Audio Controller",
      "device.form_factor": "internal",
      "device.name": "alsa_card.pci-0000_00_1f.3",
      "device.description": "Built-in Audio",
      "device.nick": "HDA Intel PCH",
      "device.icon_name": "audio-card-pci",
      "api.alsa.use-acp": "true",
      "api.acp.auto-profile": "false",
      "api.acp.auto-port": "false",
      "api.dbus.ReserveDevice1": "Audio0",
      "factory.id": "14",
      "client.id": "31",
      "object.id": "40",
      "object.serial": "40",
      "object.path": "alsa:pcm:0",
      "alsa.card": "0",
      "alsa.card_name": "HDA Intel PCH",
      "alsa.long_card_name": "HDA Intel PCH at 0xec510000 irq 153",
      "alsa.driver_name": "snd_hda_intel",
      "device.string": "0"
    },
    "Profiles": {
      "off": {
        "name": "Off",
        "info": {
          "sinks": 0,
          "sources": 0,
          "priority": 0,
          "available": "yes"
        }
      },
      "output:analog-stereo+input:analog-stereo": {
        "name": "Analog Stereo Duplex",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 6565,
          "available": "yes"
        }
      },
      "output:analog-stereo": {
        "name": "Analog Stereo Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 6500,
          "available": "yes"
        }
      },
      "output:hdmi-stereo+input:analog-stereo": {
        "name": "Digital Stereo (HDMI) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 5965,
          "available": "yes"
        }
      },
      "output:hdmi-stereo": {
        "name": "Digital Stereo (HDMI) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 5900,
          "available": "yes"
        }
      },
      "output:hdmi-stereo-extra1+input:analog-stereo": {
        "name": "Digital Stereo (HDMI 2) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 5765,
          "available": "yes"
        }
      },
      "output:hdmi-stereo-extra2+input:analog-stereo": {
        "name": "Digital Stereo (HDMI 3) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 5765,
          "available": "yes"
        }
      },
      "output:hdmi-stereo-extra3+input:analog-stereo": {
        "name": "Digital Stereo (HDMI 4) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 5765,
          "available": "yes"
        }
      },
      "output:hdmi-stereo-extra4+input:analog-stereo": {
        "name": "Digital Stereo (HDMI 5) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 5765,
          "available": "yes"
        }
      },
      "output:hdmi-stereo-extra1": {
        "name": "Digital Stereo (HDMI 2) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 5700,
          "available": "yes"
        }
      },
      "output:hdmi-stereo-extra2": {
        "name": "Digital Stereo (HDMI 3) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 5700,
          "available": "yes"
        }
      },
      "output:hdmi-stereo-extra3": {
        "name": "Digital Stereo (HDMI 4) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 5700,
          "available": "yes"
        }
      },
      "output:hdmi-stereo-extra4": {
        "name": "Digital Stereo (HDMI 5) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 5700,
          "available": "yes"
        }
      },
      "output:hdmi-surround+input:analog-stereo": {
        "name": "Digital Surround 5.1 (HDMI) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 865,
          "available": "yes"
        }
      },
      "output:hdmi-surround71+input:analog-stereo": {
        "name": "Digital Surround 7.1 (HDMI) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 865,
          "available": "yes"
        }
      },
      "output:hdmi-surround": {
        "name": "Digital Surround 5.1 (HDMI) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 800,
          "available": "yes"
        }
      },
      "output:hdmi-surround71": {
        "name": "Digital Surround 7.1 (HDMI) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 800,
          "available": "yes"
        }
      },
      "output:hdmi-surround-extra1+input:analog-stereo": {
        "name": "Digital Surround 5.1 (HDMI 2) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 665,
          "available": "yes"
        }
      },
      "output:hdmi-surround71-extra1+input:analog-stereo": {
        "name": "Digital Surround 7.1 (HDMI 2) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 665,
          "available": "yes"
        }
      },
      "output:hdmi-surround-extra2+input:analog-stereo": {
        "name": "Digital Surround 5.1 (HDMI 3) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 665,
          "available": "yes"
        }
      },
      "output:hdmi-surround71-extra2+input:analog-stereo": {
        "name": "Digital Surround 7.1 (HDMI 3) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 665,
          "available": "yes"
        }
      },
      "output:hdmi-surround-extra3+input:analog-stereo": {
        "name": "Digital Surround 5.1 (HDMI 4) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 665,
          "available": "yes"
        }
      },
      "output:hdmi-surround71-extra3+input:analog-stereo": {
        "name": "Digital Surround 7.1 (HDMI 4) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 665,
          "available": "yes"
        }
      },
      "output:hdmi-surround-extra4+input:analog-stereo": {
        "name": "Digital Surround 5.1 (HDMI 5) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 665,
          "available": "yes"
        }
      },
      "output:hdmi-surround71-extra4+input:analog-stereo": {
        "name": "Digital Surround 7.1 (HDMI 5) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 665,
          "available": "yes"
        }
      },
      "output:hdmi-surround-extra1": {
        "name": "Digital Surround 5.1 (HDMI 2) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 600,
          "available": "yes"
        }
      },
      "output:hdmi-surround71-extra1": {
        "name": "Digital Surround 7.1 (HDMI 2) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 600,
          "available": "yes"
        }
      },
      "output:hdmi-surround-extra2": {
        "name": "Digital Surround 5.1 (HDMI 3) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 600,
          "available": "yes"
        }
      },
      "output:hdmi-surround71-extra2": {
        "name": "Digital Surround 7.1 (HDMI 3) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 600,
          "available": "yes"
        }
      },
      "output:hdmi-surround-extra3": {
        "name": "Digital Surround 5.1 (HDMI 4) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 600,
          "available": "yes"
        }
      },
      "output:hdmi-surround71-extra3": {
        "name": "Digital Surround 7.1 (HDMI 4) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 600,
          "available": "yes"
        }
      },
      "output:hdmi-surround-extra4": {
        "name": "Digital Surround 5.1 (HDMI 5) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 600,
          "available": "yes"
        }
      },
      "output:hdmi-surround71-extra4": {
        "name": "Digital Surround 7.1 (HDMI 5) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 600,
          "available": "yes"
        }
      },
      "input:analog-stereo": {
        "name": "Analog Stereo Input",
        "info": {
          "sinks": 0,
          "sources": 1,
          "priority": 65,
          "available": "yes"
        }
      },
      "pro-audio": {
        "name": "Pro Audio",
        "info": {
          "sinks": 6,
          "sources": 1,
          "priority": 1,
          "available": "yes"
        }
      }
    },
    "Active Profile": "output:analog-stereo",
    "Ports": {
      "analog-input-internal-mic": {
        "name": "Internal Microphone",
        "info": {
          "type": "Mic",
          "priority": 8900,
          "latency offset": "0",
          "availability group": "Legacy 1",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "mic",
          "port.availability-group": "Legacy 1",
          "device.icon_name": "audio-input-microphone",
          "card.profile.port": "0"
        },
        "Part of profile(s)": [
          "input:analog-stereo",
          "output:analog-stereo+input:analog-stereo",
          "output:hdmi-stereo+input:analog-stereo",
          "output:hdmi-surround+input:analog-stereo",
          "output:hdmi-surround71+input:analog-stereo",
          "output:hdmi-stereo-extra1+input:analog-stereo",
          "output:hdmi-surround-extra1+input:analog-stereo",
          "output:hdmi-surround71-extra1+input:analog-stereo",
          "output:hdmi-stereo-extra2+input:analog-stereo",
          "output:hdmi-surround-extra2+input:analog-stereo",
          "output:hdmi-surround71-extra2+input:analog-stereo",
          "output:hdmi-stereo-extra3+input:analog-stereo",
          "output:hdmi-surround-extra3+input:analog-stereo",
          "output:hdmi-surround71-extra3+input:analog-stereo",
          "output:hdmi-stereo-extra4+input:analog-stereo",
          "output:hdmi-surround-extra4+input:analog-stereo",
          "output:hdmi-surround71-extra4+input:analog-stereo"
        ]
      },
      "analog-input-headphone-mic": {
        "name": "Microphone",
        "info": {
          "type": "Mic",
          "priority": 8700,
          "latency offset": "0",
          "availability group": "Legacy 2",
          "available": "no"
        },
        "Properties": {
          "port.type": "mic",
          "port.availability-group": "Legacy 2",
          "device.icon_name": "audio-input-microphone",
          "card.profile.port": "1"
        },
        "Part of profile(s)": [
          "input:analog-stereo",
          "output:analog-stereo+input:analog-stereo",
          "output:hdmi-stereo+input:analog-stereo",
          "output:hdmi-surround+input:analog-stereo",
          "output:hdmi-surround71+input:analog-stereo",
          "output:hdmi-stereo-extra1+input:analog-stereo",
          "output:hdmi-surround-extra1+input:analog-stereo",
          "output:hdmi-surround71-extra1+input:analog-stereo",
          "output:hdmi-stereo-extra2+input:analog-stereo",
          "output:hdmi-surround-extra2+input:analog-stereo",
          "output:hdmi-surround71-extra2+input:analog-stereo",
          "output:hdmi-stereo-extra3+input:analog-stereo",
          "output:hdmi-surround-extra3+input:analog-stereo",
          "output:hdmi-surround71-extra3+input:analog-stereo",
          "output:hdmi-stereo-extra4+input:analog-stereo",
          "output:hdmi-surround-extra4+input:analog-stereo",
          "output:hdmi-surround71-extra4+input:analog-stereo"
        ]
      },
      "analog-input-headset-mic": {
        "name": "Headset Microphone",
        "info": {
          "type": "Headset",
          "priority": 8800,
          "latency offset": "0",
          "availability group": "Legacy 2",
          "available": "no"
        },
        "Properties": {
          "port.type": "headset",
          "port.availability-group": "Legacy 2",
          "device.icon_name": "audio-input-microphone",
          "card.profile.port": "2"
        },
        "Part of profile(s)": [
          "input:analog-stereo",
          "output:analog-stereo+input:analog-stereo",
          "output:hdmi-stereo+input:analog-stereo",
          "output:hdmi-surround+input:analog-stereo",
          "output:hdmi-surround71+input:analog-stereo",
          "output:hdmi-stereo-extra1+input:analog-stereo",
          "output:hdmi-surround-extra1+input:analog-stereo",
          "output:hdmi-surround71-extra1+input:analog-stereo",
          "output:hdmi-stereo-extra2+input:analog-stereo",
          "output:hdmi-surround-extra2+input:analog-stereo",
          "output:hdmi-surround71-extra2+input:analog-stereo",
          "output:hdmi-stereo-extra3+input:analog-stereo",
          "output:hdmi-surround-extra3+input:analog-stereo",
          "output:hdmi-surround71-extra3+input:analog-stereo",
          "output:hdmi-stereo-extra4+input:analog-stereo",
          "output:hdmi-surround-extra4+input:analog-stereo",
          "output:hdmi-surround71-extra4+input:analog-stereo"
        ]
      },
      "analog-output-speaker": {
        "name": "Speakers",
        "info": {
          "type": "Speaker",
          "priority": 10000,
          "latency offset": "0",
          "availability group": "Legacy 3",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "speaker",
          "port.availability-group": "Legacy 3",
          "device.icon_name": "audio-speakers",
          "card.profile.port": "3"
        },
        "Part of profile(s)": [
          "output:analog-stereo",
          "output:analog-stereo+input:analog-stereo"
        ]
      },
      "analog-output-headphones": {
        "name": "Headphones",
        "info": {
          "type": "Headphones",
          "priority": 9900,
          "latency offset": "0",
          "availability group": "Legacy 2",
          "available": "no"
        },
        "Properties": {
          "port.type": "headphones",
          "port.availability-group": "Legacy 2",
          "device.icon_name": "audio-headphones",
          "card.profile.port": "4"
        },
        "Part of profile(s)": [
          "output:analog-stereo",
          "output:analog-stereo+input:analog-stereo"
        ]
      },
      "hdmi-output-0": {
        "name": "HDMI / DisplayPort",
        "info": {
          "type": "HDMI",
          "priority": 5900,
          "latency offset": "0",
          "availability group": "Legacy 4",
          "available": "no"
        },
        "Properties": {
          "port.type": "hdmi",
          "port.availability-group": "Legacy 4",
          "device.icon_name": "video-display",
          "card.profile.port": "5"
        },
        "Part of profile(s)": [
          "output:hdmi-stereo",
          "output:hdmi-stereo+input:analog-stereo",
          "output:hdmi-surround",
          "output:hdmi-surround+input:analog-stereo",
          "output:hdmi-surround71",
          "output:hdmi-surround71+input:analog-stereo"
        ]
      },
      "hdmi-output-1": {
        "name": "HDMI / DisplayPort 2",
        "info": {
          "type": "HDMI",
          "priority": 5800,
          "latency offset": "0",
          "availability group": "Legacy 5",
          "available": "no"
        },
        "Properties": {
          "port.type": "hdmi",
          "port.availability-group": "Legacy 5",
          "device.icon_name": "video-display",
          "card.profile.port": "6"
        },
        "Part of profile(s)": [
          "output:hdmi-stereo-extra1",
          "output:hdmi-stereo-extra1+input:analog-stereo",
          "output:hdmi-surround-extra1",
          "output:hdmi-surround-extra1+input:analog-stereo",
          "output:hdmi-surround71-extra1",
          "output:hdmi-surround71-extra1+input:analog-stereo"
        ]
      },
      "hdmi-output-2": {
        "name": "HDMI / DisplayPort 3",
        "info": {
          "type": "HDMI",
          "priority": 5700,
          "latency offset": "0",
          "availability group": "Legacy 6",
          "available": "no"
        },
        "Properties": {
          "port.type": "hdmi",
          "port.availability-group": "Legacy 6",
          "device.icon_name": "video-display",
          "card.profile.port": "7"
        },
        "Part of profile(s)": [
          "output:hdmi-stereo-extra2",
          "output:hdmi-stereo-extra2+input:analog-stereo",
          "output:hdmi-surround-extra2",
          "output:hdmi-surround-extra2+input:analog-stereo",
          "output:hdmi-surround71-extra2",
          "output:hdmi-surround71-extra2+input:analog-stereo"
        ]
      },
      "hdmi-output-3": {
        "name": "HDMI / DisplayPort 4",
        "info": {
          "type": "HDMI",
          "priority": 5600,
          "latency offset": "0",
          "availability group": "Legacy 7",
          "available": "no"
        },
        "Properties": {
          "port.type": "hdmi",
          "port.availability-group": "Legacy 7",
          "device.icon_name": "video-display",
          "card.profile.port": "8"
        },
        "Part of profile(s)": [
          "output:hdmi-stereo-extra3",
          "output:hdmi-stereo-extra3+input:analog-stereo",
          "output:hdmi-surround-extra3",
          "output:hdmi-surround-extra3+input:analog-stereo",
          "output:hdmi-surround71-extra3",
          "output:hdmi-surround71-extra3+input:analog-stereo"
        ]
      },
      "hdmi-output-4": {
        "name": "HDMI / DisplayPort 5",
        "info": {
          "type": "HDMI",
          "priority": 5500,
          "latency offset": "0",
          "availability group": "Legacy 8",
          "available": "no"
        },
        "Properties": {
          "port.type": "hdmi",
          "port.availability-group": "Legacy 8",
          "device.icon_name": "video-display",
          "card.profile.port": "9"
        },
        "Part of profile(s)": [
          "output:hdmi-stereo-extra4",
          "output:hdmi-stereo-extra4+input:analog-stereo",
          "output:hdmi-surround-extra4",
          "output:hdmi-surround-extra4+input:analog-stereo",
          "output:hdmi-surround71-extra4",
          "output:hdmi-surround71-extra4+input:analog-stereo"
        ]
      }
    }
  },
  "Card #125": {
    "Name": "alsa_card.usb-Generic_USB_Audio_200810111001-00",
    "Driver": "alsa",
    "Owner Module": "n/a",
    "Properties": {
      "device.enum.api": "udev",
      "device.api": "alsa",
      "media.class": "Audio/Device",
      "api.alsa.path": "hw:1",
      "api.alsa.card": "1",
      "api.alsa.card.name": "WD15 Dock",
      "api.alsa.card.longname": "Dell-WD15-Dock",
      "device.profile-set": "dell-dock-tb16-usb-audio.conf",
      "device.plugged.usec": "9673039371",
      "device.bus_path": "pci-0000:0c:00.0-usb-0:1.5:1.0",
      "sysfs.path": "/sys/devices/pci0000:00/0000:00:1d.0/0000:04:00.0/0000:05:01.0/0000:07:00.0/0000:08:04.0/0000:0a:00.0/0000:0b:01.0/0000:0c:00.0/usb3/3-1/3-1.5/3-1.5:1.0/sound/card1",
      "device.bus-id": "usb-Generic_USB_Audio_200810111001-00",
      "device.bus": "usb",
      "device.subsystem": "sound",
      "device.vendor.id": "0x0bda",
      "device.vendor.name": "Realtek Semiconductor Corp.",
      "device.product.id": "0x4014",
      "device.product.name": "USB Audio",
      "device.serial": "Generic_USB_Audio_200810111001",
      "device.name": "alsa_card.usb-Generic_USB_Audio_200810111001-00",
      "device.description": "USB Audio",
      "device.nick": "WD15 Dock",
      "device.icon_name": "audio-card-usb",
      "api.alsa.use-acp": "true",
      "api.acp.auto-profile": "false",
      "api.acp.auto-port": "false",
      "api.dbus.ReserveDevice1": "Audio1",
      "factory.id": "14",
      "client.id": "31",
      "object.id": "68",
      "object.serial": "125",
      "object.path": "alsa:pcm:1",
      "alsa.card": "1",
      "alsa.card_name": "WD15 Dock",
      "alsa.long_card_name": "Dell-WD15-Dock",
      "alsa.driver_name": "snd_usb_audio",
      "device.string": "1"
    },
    "Profiles": {
      "off": {
        "name": "Off",
        "info": {
          "sinks": 0,
          "sources": 0,
          "priority": 0,
          "available": "yes"
        }
      },
      "HiFi": {
        "name": "Default",
        "info": {
          "sinks": 2,
          "sources": 1,
          "priority": 8000,
          "available": "yes"
        }
      }
    },
    "Active Profile": "HiFi",
    "Ports": {
      "[Out] Line": {
        "name": "Line Out",
        "info": {
          "type": "Line",
          "priority": 200,
          "latency offset": "0",
          "availability group": "Line Out",
          "available": "no"
        },
        "Properties": {
          "port.type": "line",
          "port.availability-group": "Line Out",
          "card.profile.port": "0"
        },
        "Part of profile(s)": "HiFi"
      },
      "[Out] Headphones": {
        "name": "Headphones",
        "info": {
          "type": "Headphones",
          "priority": 100,
          "latency offset": "0",
          "availability group": "Headphone",
          "available": "yes"
        },
        "Properties": {
          "port.type": "headphones",
          "port.availability-group": "Headphone",
          "card.profile.port": "1"
        },
        "Part of profile(s)": "HiFi"
      },
      "[In] Headset": {
        "name": "Headset Microphone",
        "info": {
          "type": "Headset",
          "priority": 100,
          "latency offset": "0",
          "availability group": "Headset Mic",
          "available": "yes"
        },
        "Properties": {
          "port.type": "headset",
          "port.availability-group": "Headset Mic",
          "card.profile.port": "2"
        },
        "Part of profile(s)": "HiFi"
      }
    }
  },
  "Card #687": {
    "Name": "alsa_card.usb-Behringer_FLOW_8_05-FF-01-01-73-71-00",
    "Driver": "alsa",
    "Owner Module": "n/a",
    "Properties": {
      "device.enum.api": "udev",
      "device.api": "alsa",
      "media.class": "Audio/Device",
      "api.alsa.path": "hw:2",
      "api.alsa.card": "2",
      "api.alsa.card.name": "FLOW 8",
      "api.alsa.card.longname": "Behringer FLOW 8 at usb-0000:00:14.0-2, high speed",
      "device.plugged.usec": "29743386072",
      "device.bus_path": "pci-0000:00:14.0-usb-0:2:1.0",
      "sysfs.path": "/sys/devices/pci0000:00/0000:00:14.0/usb1/1-2/1-2:1.0/sound/card2",
      "device.bus-id": "usb-Behringer_FLOW_8_05-FF-01-01-73-71-00",
      "device.bus": "usb",
      "device.subsystem": "sound",
      "device.vendor.id": "0x1397",
      "device.vendor.name": "BEHRINGER International GmbH",
      "device.product.id": "0x050c",
      "device.product.name": "FLOW 8",
      "device.serial": "Behringer_FLOW_8_05-FF-01-01-73-71",
      "device.name": "alsa_card.usb-Behringer_FLOW_8_05-FF-01-01-73-71-00",
      "device.description": "FLOW 8",
      "device.nick": "FLOW 8",
      "device.icon_name": "audio-card-usb",
      "api.alsa.use-acp": "true",
      "api.acp.auto-profile": "false",
      "api.acp.auto-port": "false",
      "api.dbus.ReserveDevice1": "Audio2",
      "factory.id": "14",
      "client.id": "31",
      "object.id": "217",
      "object.serial": "687",
      "object.path": "alsa:pcm:2",
      "alsa.card": "2",
      "alsa.card_name": "FLOW 8",
      "alsa.long_card_name": "Behringer FLOW 8 at usb-0000:00:14.0-2, high speed",
      "alsa.driver_name": "snd_usb_audio",
      "device.string": "2"
    },
    "Profiles": {
      "off": {
        "name": "Off",
        "info": {
          "sinks": 0,
          "sources": 0,
          "priority": 0,
          "available": "yes"
        }
      },
      "Direct": {
        "name": "Direct Flow8 Recording",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 1,
          "available": "yes"
        }
      },
      "Recording": {
        "name": "Recording Mode (4 chan output, 10 chan input)",
        "info": {
          "sinks": 2,
          "sources": 11,
          "priority": 1,
          "available": "yes"
        }
      }
    },
    "Active Profile": "Direct",
    "Ports": {
      "[Out] Direct": {
        "name": "Direct FLOW 8",
        "info": {
          "type": "Unknown",
          "priority": 1000,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "unknown",
          "card.profile.port": "0"
        },
        "Part of profile(s)": "Direct"
      },
      "[In] Direct": {
        "name": "Direct FLOW 8",
        "info": {
          "type": "Unknown",
          "priority": 1000,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "unknown",
          "card.profile.port": "1"
        },
        "Part of profile(s)": "Direct"
      },
      "[Out] Line2": {
        "name": "USB-34 L/R",
        "info": {
          "type": "Line",
          "priority": 200,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "line",
          "card.profile.port": "2"
        },
        "Part of profile(s)": "Recording"
      },
      "[Out] Line1": {
        "name": "USB-12 L/R",
        "info": {
          "type": "Line",
          "priority": 100,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "line",
          "card.profile.port": "3"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] LineMaster": {
        "name": "Master/Monitor L/R",
        "info": {
          "type": "Unknown",
          "priority": 110,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "unknown",
          "card.profile.port": "4"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Line78": {
        "name": "Line-78 L/R",
        "info": {
          "type": "Line",
          "priority": 109,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "line",
          "card.profile.port": "5"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Line56": {
        "name": "Line-56 L/R",
        "info": {
          "type": "Line",
          "priority": 108,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "line",
          "card.profile.port": "6"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Line8": {
        "name": "Line/Inst(HiZ) 8 (R)",
        "info": {
          "type": "Line",
          "priority": 107,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "line",
          "card.profile.port": "7"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Line7": {
        "name": "Line/Inst 7 (L)",
        "info": {
          "type": "Line",
          "priority": 106,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "line",
          "card.profile.port": "8"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Line6": {
        "name": "Line/Inst(HiZ) 6 (R)",
        "info": {
          "type": "Line",
          "priority": 105,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "line",
          "card.profile.port": "9"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Line5": {
        "name": "Line/Inst 5 (L)",
        "info": {
          "type": "Line",
          "priority": 104,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "line",
          "card.profile.port": "10"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Mic4": {
        "name": "Mic 4",
        "info": {
          "type": "Mic",
          "priority": 103,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "mic",
          "card.profile.port": "11"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Mic3": {
        "name": "Mic 3",
        "info": {
          "type": "Mic",
          "priority": 102,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "mic",
          "card.profile.port": "12"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Mic2": {
        "name": "Mic 2",
        "info": {
          "type": "Mic",
          "priority": 101,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "mic",
          "card.profile.port": "13"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Mic1": {
        "name": "Mic 1",
        "info": {
          "type": "Mic",
          "priority": 100,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "mic",
          "card.profile.port": "14"
        },
        "Part of profile(s)": "Recording"
      }
    }
  }
}
```

Example output of `await list();` and `pactljson list`:
``` JSON
{
  "Module #1": {
    "Name": "libpipewire-module-rt",
    "Argument": "{\n    nice.level    = -11\n    #rt.prio      = 88\n    #rt.time.soft = -1\n    #rt.time.hard = -1\n}",
    "Properties": {
      "module.name": "libpipewire-module-rt",
      "object.id": "1",
      "object.serial": "1",
      "module.author": "Wim Taymans <wim.taymans@gmail.com>",
      "module.description": "Use realtime thread scheduling, falling back to RTKit",
      "module.usage": "[nice.level=<priority: default 20(don't change)>] [rt.prio=<priority: default 88>] [rt.time.soft=<in usec: default -1] [rt.time.hard=<in usec: default -1]",
      "module.version": "0.3.56",
      "nice.level": "-11"
    }
  },
  "Module #2": {
    "Name": "libpipewire-module-protocol-native",
    "Argument": {},
    "Usage counter": "n/a",
    "Properties": {
      "module.name": "libpipewire-module-protocol-native",
      "object.id": "2",
      "object.serial": "2",
      "module.author": "Wim Taymans <wim.taymans@gmail.com>",
      "module.description": "Native protocol using unix sockets",
      "module.version": "0.3.56"
    }
  },
  "Module #3": {
    "Name": "libpipewire-module-profiler",
    "Argument": {},
    "Usage counter": "n/a",
    "Properties": {
      "module.name": "libpipewire-module-profiler",
      "object.id": "3",
      "object.serial": "3",
      "module.author": "Wim Taymans <wim.taymans@gmail.com>",
      "module.description": "Generate Profiling data",
      "module.version": "0.3.56"
    }
  },
  "Module #5": {
    "Name": "libpipewire-module-metadata",
    "Argument": {},
    "Usage counter": "n/a",
    "Properties": {
      "module.name": "libpipewire-module-metadata",
      "object.id": "5",
      "object.serial": "5",
      "module.author": "Wim Taymans <wim.taymans@gmail.com>",
      "module.description": "Allow clients to create metadata store",
      "module.version": "0.3.56"
    }
  },
  "Module #7": {
    "Name": "libpipewire-module-spa-device-factory",
    "Argument": {},
    "Usage counter": "n/a",
    "Properties": {
      "module.name": "libpipewire-module-spa-device-factory",
      "object.id": "7",
      "object.serial": "7",
      "module.author": "Wim Taymans <wim.taymans@gmail.com>",
      "module.description": "Provide a factory to make SPA devices",
      "module.version": "0.3.56"
    }
  },
  "Module #9": {
    "Name": "libpipewire-module-spa-node-factory",
    "Argument": {},
    "Usage counter": "n/a",
    "Properties": {
      "module.name": "libpipewire-module-spa-node-factory",
      "object.id": "9",
      "object.serial": "9",
      "module.author": "Wim Taymans <wim.taymans@gmail.com>",
      "module.description": "Provide a factory to make SPA nodes",
      "module.version": "0.3.56"
    }
  },
  "Module #11": {
    "Name": "libpipewire-module-client-node",
    "Argument": {},
    "Usage counter": "n/a",
    "Properties": {
      "module.name": "libpipewire-module-client-node",
      "object.id": "11",
      "object.serial": "11",
      "module.author": "Wim Taymans <wim.taymans@gmail.com>",
      "module.description": "Allow clients to create and control remote nodes",
      "module.version": "0.3.56"
    }
  },
  "Module #13": {
    "Name": "libpipewire-module-client-device",
    "Argument": {},
    "Usage counter": "n/a",
    "Properties": {
      "module.name": "libpipewire-module-client-device",
      "object.id": "13",
      "object.serial": "13",
      "module.author": "Wim Taymans <wim.taymans@gmail.com>",
      "module.description": "Allow clients to create and control remote devices",
      "module.version": "0.3.56"
    }
  },
  "Module #15": {
    "Name": "libpipewire-module-portal",
    "Argument": {},
    "Usage counter": "n/a",
    "Properties": {
      "module.name": "libpipewire-module-portal",
      "object.id": "15",
      "object.serial": "15"
    }
  },
  "Module #16": {
    "Name": "libpipewire-module-access",
    "Argument": "{\n    # access.allowed to list an array of paths of allowed\n    # apps.\n    #access.allowed = [\n    #    /usr/bin/pipewire-media-session\n    #]\n}",
    "#access.rejected": "[ ]",
    "# An array of paths with restricted access.": {
      "#access.restricted": "[ ]",
      "# Anything not in the above lists gets assigned the": {
        "# access.force permission.": {
          "#access.force": "flatpak",
          "}": {}
        }
      }
    },
    "Usage counter": "n/a",
    "Properties": {
      "module.name": "libpipewire-module-access",
      "object.id": "16",
      "object.serial": "16",
      "module.author": "Wim Taymans <wim.taymans@gmail.com>",
      "module.description": "Perform access check",
      "module.usage": "[ access.force=flatpak ] [ access.allowed=<cmd-line> ] [ access.rejected=<cmd-line> ] [ access.restricted=<cmd-line> ]",
      "module.version": "0.3.56"
    }
  },
  "Module #17": {
    "Name": "libpipewire-module-adapter",
    "Argument": {},
    "Usage counter": "n/a",
    "Properties": {
      "module.name": "libpipewire-module-adapter",
      "object.id": "17",
      "object.serial": "17",
      "module.author": "Wim Taymans <wim.taymans@gmail.com>",
      "module.description": "Manage adapter nodes",
      "module.version": "0.3.56"
    }
  },
  "Module #19": {
    "Name": "libpipewire-module-link-factory",
    "Argument": {},
    "Usage counter": "n/a",
    "Properties": {
      "module.name": "libpipewire-module-link-factory",
      "object.id": "19",
      "object.serial": "19",
      "module.author": "Wim Taymans <wim.taymans@gmail.com>",
      "module.description": "Allow clients to create links",
      "module.version": "0.3.56"
    }
  },
  "Module #21": {
    "Name": "libpipewire-module-session-manager",
    "Argument": {},
    "Usage counter": "n/a",
    "Properties": {
      "module.name": "libpipewire-module-session-manager",
      "object.id": "21",
      "object.serial": "21",
      "module.author": "George Kiagiadakis <george.kiagiadakis@collabora.com>",
      "module.description": "Implements objects for session management",
      "module.version": "0.3.56"
    }
  },
  "Module #536870912": {
    "Name": "module-always-sink",
    "Argument": {},
    "Usage counter": "n/a",
    "Properties": {
      "module.author": "Pauli Virtanen <pav@iki.fi>",
      "module.description": "Always keeps at least one sink loaded even if it's a null one",
      "module.usage": "sink_name=<name of sink>",
      "module.version": "0.3.56"
    }
  },
  "Sink #126": {
    "State": "IDLE",
    "Name": "alsa_output.usb-Generic_USB_Audio_200810111001-00.HiFi__hw_Dock_1__sink",
    "Description": "USB Audio Line Out",
    "Driver": "PipeWire",
    "Sample Specification": {
      "name": "s24le",
      "sampleSize": 24,
      "samplingRate": 48000,
      "endianess": "Little",
      "dataType": "Signed Integer",
      "channelCount": 2
    },
    "Channel Map": [
      "front-left",
      "front-right"
    ],
    "Owner Module": "4294967295",
    "Mute": "no",
    "Volume": {
      "channels": {
        "front-left": {
          "raw": 26826,
          "percent": 41,
          "decibels": -23.28
        },
        "front-right": {
          "raw": 26826,
          "percent": 41,
          "decibels": -23.28
        }
      },
      "balance": "0.00"
    },
    "Base Volume": {
      "raw": 65536,
      "percent": 100,
      "decibels": 0
    },
    "Monitor Source": "alsa_output.usb-Generic_USB_Audio_200810111001-00.HiFi__hw_Dock_1__sink.monitor",
    "Latency": {
      "actual": 0,
      "configured": 0
    },
    "Flags": [
      "HARDWARE",
      "DECIBEL_VOLUME",
      "LATENCY"
    ],
    "Properties": {
      "object.path": "alsa:pcm:1:hw:Dock,1:playback",
      "api.alsa.path": "hw:Dock,1",
      "api.alsa.open.ucm": "true",
      "api.alsa.pcm.card": "1",
      "api.alsa.pcm.stream": "playback",
      "audio.channels": "2",
      "audio.position": [
        "FL",
        "FR"
      ],
      "device.routes": "1",
      "alsa.mixer_device": "_ucm0003.hw:Dock",
      "alsa.resolution_bits": "24",
      "device.api": "alsa",
      "device.class": "sound",
      "alsa.class": "generic",
      "alsa.subclass": "generic-mix",
      "alsa.name": "USB Audio #1",
      "alsa.id": "USB Audio",
      "alsa.subdevice": "0",
      "alsa.subdevice_name": "subdevice #0",
      "alsa.device": "1",
      "alsa.card": "1",
      "alsa.card_name": "WD15 Dock",
      "alsa.long_card_name": "Dell-WD15-Dock",
      "alsa.driver_name": "snd_usb_audio",
      "device.profile.name": "HiFi: hw:Dock,1: sink",
      "device.profile.description": "Line Out",
      "card.profile.device": "0",
      "device.id": "68",
      "factory.name": "api.alsa.pcm.sink",
      "priority.driver": "664",
      "priority.session": "664",
      "media.class": "Audio/Sink",
      "node.nick": "WD15 Dock",
      "node.name": "alsa_output.usb-Generic_USB_Audio_200810111001-00.HiFi__hw_Dock_1__sink",
      "device.description": "USB Audio",
      "device.icon_name": "audio-card",
      "device.bus": "usb",
      "device.bus_path": "pci-0000:0c:00.0-usb-0:1.5:1.0",
      "node.pause-on-idle": "false",
      "factory.id": "18",
      "clock.quantum-limit": "8192",
      "client.id": "32",
      "node.driver": "true",
      "factory.mode": "merge",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "object.id": "66",
      "object.serial": "126",
      "node.max-latency": "16384/48000",
      "device.enum.api": "udev",
      "api.alsa.card": "1",
      "api.alsa.card.name": "WD15 Dock",
      "api.alsa.card.longname": "Dell-WD15-Dock",
      "device.profile-set": "dell-dock-tb16-usb-audio.conf",
      "device.plugged.usec": "9673039371",
      "sysfs.path": "/sys/devices/pci0000:00/0000:00:1d.0/0000:04:00.0/0000:05:01.0/0000:07:00.0/0000:08:04.0/0000:0a:00.0/0000:0b:01.0/0000:0c:00.0/usb3/3-1/3-1.5/3-1.5:1.0/sound/card1",
      "device.bus-id": "usb-Generic_USB_Audio_200810111001-00",
      "device.subsystem": "sound",
      "device.vendor.id": "0x0bda",
      "device.vendor.name": "Realtek Semiconductor Corp.",
      "device.product.id": "0x4014",
      "device.product.name": "USB Audio",
      "device.serial": "Generic_USB_Audio_200810111001",
      "device.name": "alsa_card.usb-Generic_USB_Audio_200810111001-00",
      "device.nick": "WD15 Dock",
      "api.alsa.use-acp": "true",
      "api.acp.auto-profile": "false",
      "api.acp.auto-port": "false",
      "api.dbus.ReserveDevice1": "Audio1",
      "device.string": "1"
    },
    "Ports": {
      "[Out] Line": {
        "name": "Line Out",
        "info": {
          "type": "Line",
          "priority": 200,
          "availability group": "Line Out",
          "available": "no"
        }
      }
    },
    "Active Port": "[Out] Line",
    "Formats": [
      "pcm"
    ]
  },
  "Sink #127": {
    "State": "IDLE",
    "Name": "alsa_output.usb-Generic_USB_Audio_200810111001-00.HiFi__hw_Dock__sink",
    "Description": "USB Audio Headphones",
    "Driver": "PipeWire",
    "Sample Specification": {
      "name": "s24le",
      "sampleSize": 24,
      "samplingRate": 48000,
      "endianess": "Little",
      "dataType": "Signed Integer",
      "channelCount": 2
    },
    "Channel Map": [
      "front-left",
      "front-right"
    ],
    "Owner Module": "4294967295",
    "Mute": "no",
    "Volume": {
      "channels": {
        "front-left": {
          "raw": 65412,
          "percent": 100,
          "decibels": -0.05
        },
        "front-right": {
          "raw": 65412,
          "percent": 100,
          "decibels": -0.05
        }
      },
      "balance": "0.00"
    },
    "Base Volume": {
      "raw": 65536,
      "percent": 100,
      "decibels": 0
    },
    "Monitor Source": "alsa_output.usb-Generic_USB_Audio_200810111001-00.HiFi__hw_Dock__sink.monitor",
    "Latency": {
      "actual": 0,
      "configured": 0
    },
    "Flags": [
      "HARDWARE",
      "DECIBEL_VOLUME",
      "LATENCY"
    ],
    "Properties": {
      "object.path": "alsa:pcm:1:hw:Dock:playback",
      "api.alsa.path": "hw:Dock",
      "api.alsa.open.ucm": "true",
      "api.alsa.pcm.card": "1",
      "api.alsa.pcm.stream": "playback",
      "audio.channels": "2",
      "audio.position": [
        "FL",
        "FR"
      ],
      "device.routes": "1",
      "alsa.mixer_device": "_ucm0003.hw:Dock",
      "alsa.resolution_bits": "24",
      "device.api": "alsa",
      "device.class": "sound",
      "alsa.class": "generic",
      "alsa.subclass": "generic-mix",
      "alsa.name": "USB Audio",
      "alsa.id": "USB Audio",
      "alsa.subdevice": "0",
      "alsa.subdevice_name": "subdevice #0",
      "alsa.device": "0",
      "alsa.card": "1",
      "alsa.card_name": "WD15 Dock",
      "alsa.long_card_name": "Dell-WD15-Dock",
      "alsa.driver_name": "snd_usb_audio",
      "device.profile.name": "HiFi: hw:Dock: sink",
      "device.profile.description": "Headphones",
      "card.profile.device": "1",
      "device.id": "68",
      "factory.name": "api.alsa.pcm.sink",
      "priority.driver": "680",
      "priority.session": "680",
      "media.class": "Audio/Sink",
      "node.nick": "WD15 Dock",
      "node.name": "alsa_output.usb-Generic_USB_Audio_200810111001-00.HiFi__hw_Dock__sink",
      "device.description": "USB Audio",
      "device.icon_name": "audio-card",
      "device.bus": "usb",
      "device.bus_path": "pci-0000:0c:00.0-usb-0:1.5:1.0",
      "node.pause-on-idle": "false",
      "factory.id": "18",
      "clock.quantum-limit": "8192",
      "client.id": "32",
      "node.driver": "true",
      "factory.mode": "merge",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "object.id": "71",
      "object.serial": "127",
      "node.max-latency": "16384/48000",
      "device.enum.api": "udev",
      "api.alsa.card": "1",
      "api.alsa.card.name": "WD15 Dock",
      "api.alsa.card.longname": "Dell-WD15-Dock",
      "device.profile-set": "dell-dock-tb16-usb-audio.conf",
      "device.plugged.usec": "9673039371",
      "sysfs.path": "/sys/devices/pci0000:00/0000:00:1d.0/0000:04:00.0/0000:05:01.0/0000:07:00.0/0000:08:04.0/0000:0a:00.0/0000:0b:01.0/0000:0c:00.0/usb3/3-1/3-1.5/3-1.5:1.0/sound/card1",
      "device.bus-id": "usb-Generic_USB_Audio_200810111001-00",
      "device.subsystem": "sound",
      "device.vendor.id": "0x0bda",
      "device.vendor.name": "Realtek Semiconductor Corp.",
      "device.product.id": "0x4014",
      "device.product.name": "USB Audio",
      "device.serial": "Generic_USB_Audio_200810111001",
      "device.name": "alsa_card.usb-Generic_USB_Audio_200810111001-00",
      "device.nick": "WD15 Dock",
      "api.alsa.use-acp": "true",
      "api.acp.auto-profile": "false",
      "api.acp.auto-port": "false",
      "api.dbus.ReserveDevice1": "Audio1",
      "device.string": "1"
    },
    "Ports": {
      "[Out] Headphones": {
        "name": "Headphones",
        "info": {
          "type": "Headphones",
          "priority": 100,
          "availability group": "Headphone",
          "available": "yes"
        }
      }
    },
    "Active Port": "[Out] Headphones",
    "Formats": [
      "pcm"
    ]
  },
  "Sink #547": {
    "State": "RUNNING",
    "Name": "alsa_output.pci-0000_00_1f.3.analog-stereo",
    "Description": "Built-in Audio Analog Stereo",
    "Driver": "PipeWire",
    "Sample Specification": {
      "name": "s32le",
      "sampleSize": 32,
      "samplingRate": 48000,
      "endianess": "Little",
      "dataType": "Signed Integer",
      "channelCount": 2
    },
    "Channel Map": [
      "front-left",
      "front-right"
    ],
    "Owner Module": "4294967295",
    "Mute": "no",
    "Volume": {
      "channels": {
        "front-left": {
          "raw": 47184,
          "percent": 72,
          "decibels": -8.56
        },
        "front-right": {
          "raw": 47184,
          "percent": 72,
          "decibels": -8.56
        }
      },
      "balance": "0.00"
    },
    "Base Volume": {
      "raw": 65536,
      "percent": 100,
      "decibels": 0
    },
    "Monitor Source": "alsa_output.pci-0000_00_1f.3.analog-stereo.monitor",
    "Latency": {
      "actual": 0,
      "configured": 0
    },
    "Flags": [
      "HARDWARE",
      "HW_MUTE_CTRL",
      "HW_VOLUME_CTRL",
      "DECIBEL_VOLUME",
      "LATENCY"
    ],
    "Properties": {
      "object.path": "alsa:pcm:0:front:0:playback",
      "api.alsa.path": "front:0",
      "api.alsa.pcm.card": "0",
      "api.alsa.pcm.stream": "playback",
      "audio.channels": "2",
      "audio.position": [
        "FL",
        "FR"
      ],
      "device.routes": "2",
      "alsa.resolution_bits": "16",
      "device.api": "alsa",
      "device.class": "sound",
      "alsa.class": "generic",
      "alsa.subclass": "generic-mix",
      "alsa.name": "ALC3271 Analog",
      "alsa.id": "ALC3271 Analog",
      "alsa.subdevice": "0",
      "alsa.subdevice_name": "subdevice #0",
      "alsa.device": "0",
      "alsa.card": "0",
      "alsa.card_name": "HDA Intel PCH",
      "alsa.long_card_name": "HDA Intel PCH at 0xec510000 irq 153",
      "alsa.driver_name": "snd_hda_intel",
      "device.profile.name": "analog-stereo",
      "device.profile.description": "Analog Stereo",
      "card.profile.device": "8",
      "device.id": "40",
      "factory.name": "api.alsa.pcm.sink",
      "priority.driver": "1009",
      "priority.session": "1009",
      "media.class": "Audio/Sink",
      "node.nick": "HDA Intel PCH",
      "node.name": "alsa_output.pci-0000_00_1f.3.analog-stereo",
      "device.description": "Built-in Audio",
      "device.icon_name": "audio-card-analog",
      "device.bus": "pci",
      "device.bus_path": "pci-0000:00:1f.3",
      "device.form_factor": "internal",
      "node.pause-on-idle": "false",
      "factory.id": "18",
      "clock.quantum-limit": "8192",
      "client.id": "32",
      "node.driver": "true",
      "factory.mode": "merge",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "object.id": "187",
      "object.serial": "547",
      "node.max-latency": "16384/48000",
      "device.enum.api": "udev",
      "api.alsa.card": "0",
      "api.alsa.card.name": "HDA Intel PCH",
      "api.alsa.card.longname": "HDA Intel PCH at 0xec510000 irq 153",
      "device.plugged.usec": "22073351",
      "sysfs.path": "/sys/devices/pci0000:00/0000:00:1f.3/sound/card0",
      "device.subsystem": "sound",
      "device.vendor.id": "0x8086",
      "device.vendor.name": "Intel Corporation",
      "device.product.id": "0xa171",
      "device.product.name": "CM238 HD Audio Controller",
      "device.name": "alsa_card.pci-0000_00_1f.3",
      "device.nick": "HDA Intel PCH",
      "api.alsa.use-acp": "true",
      "api.acp.auto-profile": "false",
      "api.acp.auto-port": "false",
      "api.dbus.ReserveDevice1": "Audio0",
      "device.string": "0"
    },
    "Ports": {
      "analog-output-speaker": {
        "name": "Speakers",
        "info": {
          "type": "Speaker",
          "priority": 10000,
          "availability group": "Legacy 3",
          "available": "unknown"
        }
      },
      "analog-output-headphones": {
        "name": "Headphones",
        "info": {
          "type": "Headphones",
          "priority": 9900,
          "availability group": "Legacy 2",
          "available": "no"
        }
      }
    },
    "Active Port": "analog-output-speaker",
    "Formats": [
      "pcm"
    ]
  },
  "Sink #688": {
    "State": "IDLE",
    "Name": "alsa_output.usb-Behringer_FLOW_8_05-FF-01-01-73-71-00.Direct__hw_F8__sink",
    "Description": "FLOW 8 Direct FLOW 8",
    "Driver": "PipeWire",
    "Sample Specification": {
      "name": "s32le",
      "sampleSize": 32,
      "samplingRate": 48000,
      "endianess": "Little",
      "dataType": "Signed Integer",
      "channelCount": 4
    },
    "Channel Map": [
      "front-left",
      "front-right",
      "rear-left",
      "rear-right"
    ],
    "Owner Module": "4294967295",
    "Mute": "no",
    "Volume": {
      "channels": {
        "front-left": {
          "raw": 48287,
          "percent": 74,
          "decibels": -7.96
        },
        "front-right": {
          "raw": 48287,
          "percent": 74,
          "decibels": -7.96
        },
        "rear-left": {
          "raw": 48287,
          "percent": 74,
          "decibels": -7.96
        },
        "rear-right": {
          "raw": 48287,
          "percent": 74,
          "decibels": -7.96
        }
      },
      "balance": "0.00"
    },
    "Base Volume": {
      "raw": 65536,
      "percent": 100,
      "decibels": 0
    },
    "Monitor Source": "alsa_output.usb-Behringer_FLOW_8_05-FF-01-01-73-71-00.Direct__hw_F8__sink.monitor",
    "Latency": {
      "actual": 0,
      "configured": 0
    },
    "Flags": [
      "HARDWARE",
      "DECIBEL_VOLUME",
      "LATENCY"
    ],
    "Properties": {
      "object.path": "alsa:pcm:2:hw:F8:playback",
      "api.alsa.path": "hw:F8",
      "api.alsa.open.ucm": "true",
      "api.alsa.pcm.card": "2",
      "api.alsa.pcm.stream": "playback",
      "audio.channels": "4",
      "audio.position": [
        "FL",
        "FR",
        "RL",
        "RR"
      ],
      "device.routes": "1",
      "alsa.mixer_device": "_ucm0004.hw:F8",
      "alsa.resolution_bits": "32",
      "device.api": "alsa",
      "device.class": "sound",
      "alsa.class": "generic",
      "alsa.subclass": "generic-mix",
      "alsa.name": "USB Audio",
      "alsa.id": "USB Audio",
      "alsa.subdevice": "0",
      "alsa.subdevice_name": "subdevice #0",
      "alsa.device": "0",
      "alsa.card": "2",
      "alsa.card_name": "FLOW 8",
      "alsa.long_card_name": "Behringer FLOW 8 at usb-0000:00:14.0-2, high speed",
      "alsa.driver_name": "snd_usb_audio",
      "device.profile.name": "Direct: hw:F8: sink",
      "device.profile.description": "Direct FLOW 8",
      "card.profile.device": "0",
      "device.id": "217",
      "factory.name": "api.alsa.pcm.sink",
      "priority.driver": "872",
      "priority.session": "872",
      "media.class": "Audio/Sink",
      "node.nick": "FLOW 8",
      "node.name": "alsa_output.usb-Behringer_FLOW_8_05-FF-01-01-73-71-00.Direct__hw_F8__sink",
      "device.description": "FLOW 8",
      "device.icon_name": "audio-card",
      "device.bus": "usb",
      "device.bus_path": "pci-0000:00:14.0-usb-0:2:1.0",
      "node.pause-on-idle": "false",
      "factory.id": "18",
      "clock.quantum-limit": "8192",
      "client.id": "32",
      "node.driver": "true",
      "factory.mode": "merge",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "object.id": "205",
      "object.serial": "688",
      "node.max-latency": "16384/48000",
      "device.enum.api": "udev",
      "api.alsa.card": "2",
      "api.alsa.card.name": "FLOW 8",
      "api.alsa.card.longname": "Behringer FLOW 8 at usb-0000:00:14.0-2, high speed",
      "device.plugged.usec": "29743386072",
      "sysfs.path": "/sys/devices/pci0000:00/0000:00:14.0/usb1/1-2/1-2:1.0/sound/card2",
      "device.bus-id": "usb-Behringer_FLOW_8_05-FF-01-01-73-71-00",
      "device.subsystem": "sound",
      "device.vendor.id": "0x1397",
      "device.vendor.name": "BEHRINGER International GmbH",
      "device.product.id": "0x050c",
      "device.product.name": "FLOW 8",
      "device.serial": "Behringer_FLOW_8_05-FF-01-01-73-71",
      "device.name": "alsa_card.usb-Behringer_FLOW_8_05-FF-01-01-73-71-00",
      "device.nick": "FLOW 8",
      "api.alsa.use-acp": "true",
      "api.acp.auto-profile": "false",
      "api.acp.auto-port": "false",
      "api.dbus.ReserveDevice1": "Audio2",
      "device.string": "2"
    },
    "Ports": {
      "[Out] Direct": {
        "name": "Direct FLOW 8",
        "info": {
          "type": "Unknown",
          "priority": 1000,
          "available": "unknown"
        }
      }
    },
    "Active Port": "[Out] Direct",
    "Formats": [
      "pcm"
    ]
  },
  "Source #126": {
    "State": "RUNNING",
    "Name": "alsa_output.usb-Generic_USB_Audio_200810111001-00.HiFi__hw_Dock_1__sink.monitor",
    "Description": "Monitor of USB Audio Line Out",
    "Driver": "PipeWire",
    "Sample Specification": {
      "name": "s24le",
      "sampleSize": 24,
      "samplingRate": 48000,
      "endianess": "Little",
      "dataType": "Signed Integer",
      "channelCount": 2
    },
    "Channel Map": [
      "front-left",
      "front-right"
    ],
    "Owner Module": "4294967295",
    "Mute": "no",
    "Volume": {
      "channels": {
        "front-left": {
          "raw": 65536,
          "percent": 100,
          "decibels": 0
        },
        "front-right": {
          "raw": 65536,
          "percent": 100,
          "decibels": 0
        }
      },
      "balance": "0.00"
    },
    "Base Volume": {
      "raw": 65536,
      "percent": 100,
      "decibels": 0
    },
    "Monitor of Sink": "alsa_output.usb-Generic_USB_Audio_200810111001-00.HiFi__hw_Dock_1__sink",
    "Latency": {
      "actual": 0,
      "configured": 0
    },
    "Flags": [
      "HARDWARE",
      "DECIBEL_VOLUME",
      "LATENCY"
    ],
    "Properties": {
      "object.path": "alsa:pcm:1:hw:Dock,1:playback",
      "api.alsa.path": "hw:Dock,1",
      "api.alsa.open.ucm": "true",
      "api.alsa.pcm.card": "1",
      "api.alsa.pcm.stream": "playback",
      "audio.channels": "2",
      "audio.position": [
        "FL",
        "FR"
      ],
      "device.routes": "1",
      "alsa.mixer_device": "_ucm0003.hw:Dock",
      "alsa.resolution_bits": "24",
      "device.api": "alsa",
      "device.class": "monitor",
      "alsa.class": "generic",
      "alsa.subclass": "generic-mix",
      "alsa.name": "USB Audio #1",
      "alsa.id": "USB Audio",
      "alsa.subdevice": "0",
      "alsa.subdevice_name": "subdevice #0",
      "alsa.device": "1",
      "alsa.card": "1",
      "alsa.card_name": "WD15 Dock",
      "alsa.long_card_name": "Dell-WD15-Dock",
      "alsa.driver_name": "snd_usb_audio",
      "device.profile.name": "HiFi: hw:Dock,1: sink",
      "device.profile.description": "Line Out",
      "card.profile.device": "0",
      "device.id": "68",
      "factory.name": "api.alsa.pcm.sink",
      "priority.driver": "664",
      "priority.session": "664",
      "media.class": "Audio/Sink",
      "node.nick": "WD15 Dock",
      "node.name": "alsa_output.usb-Generic_USB_Audio_200810111001-00.HiFi__hw_Dock_1__sink",
      "device.description": "USB Audio",
      "device.icon_name": "audio-card",
      "device.bus": "usb",
      "device.bus_path": "pci-0000:0c:00.0-usb-0:1.5:1.0",
      "node.pause-on-idle": "false",
      "factory.id": "18",
      "clock.quantum-limit": "8192",
      "client.id": "32",
      "node.driver": "true",
      "factory.mode": "merge",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "object.id": "66",
      "object.serial": "126",
      "node.max-latency": "16384/48000",
      "device.enum.api": "udev",
      "api.alsa.card": "1",
      "api.alsa.card.name": "WD15 Dock",
      "api.alsa.card.longname": "Dell-WD15-Dock",
      "device.profile-set": "dell-dock-tb16-usb-audio.conf",
      "device.plugged.usec": "9673039371",
      "sysfs.path": "/sys/devices/pci0000:00/0000:00:1d.0/0000:04:00.0/0000:05:01.0/0000:07:00.0/0000:08:04.0/0000:0a:00.0/0000:0b:01.0/0000:0c:00.0/usb3/3-1/3-1.5/3-1.5:1.0/sound/card1",
      "device.bus-id": "usb-Generic_USB_Audio_200810111001-00",
      "device.subsystem": "sound",
      "device.vendor.id": "0x0bda",
      "device.vendor.name": "Realtek Semiconductor Corp.",
      "device.product.id": "0x4014",
      "device.product.name": "USB Audio",
      "device.serial": "Generic_USB_Audio_200810111001",
      "device.name": "alsa_card.usb-Generic_USB_Audio_200810111001-00",
      "device.nick": "WD15 Dock",
      "api.alsa.use-acp": "true",
      "api.acp.auto-profile": "false",
      "api.acp.auto-port": "false",
      "api.dbus.ReserveDevice1": "Audio1",
      "device.string": "1"
    },
    "Formats": [
      "pcm"
    ]
  },
  "Source #127": {
    "State": "RUNNING",
    "Name": "alsa_output.usb-Generic_USB_Audio_200810111001-00.HiFi__hw_Dock__sink.monitor",
    "Description": "Monitor of USB Audio Headphones",
    "Driver": "PipeWire",
    "Sample Specification": {
      "name": "s24le",
      "sampleSize": 24,
      "samplingRate": 48000,
      "endianess": "Little",
      "dataType": "Signed Integer",
      "channelCount": 2
    },
    "Channel Map": [
      "front-left",
      "front-right"
    ],
    "Owner Module": "4294967295",
    "Mute": "no",
    "Volume": {
      "channels": {
        "front-left": {
          "raw": 65536,
          "percent": 100,
          "decibels": 0
        },
        "front-right": {
          "raw": 65536,
          "percent": 100,
          "decibels": 0
        }
      },
      "balance": "0.00"
    },
    "Base Volume": {
      "raw": 65536,
      "percent": 100,
      "decibels": 0
    },
    "Monitor of Sink": "alsa_output.usb-Generic_USB_Audio_200810111001-00.HiFi__hw_Dock__sink",
    "Latency": {
      "actual": 0,
      "configured": 0
    },
    "Flags": [
      "HARDWARE",
      "DECIBEL_VOLUME",
      "LATENCY"
    ],
    "Properties": {
      "object.path": "alsa:pcm:1:hw:Dock:playback",
      "api.alsa.path": "hw:Dock",
      "api.alsa.open.ucm": "true",
      "api.alsa.pcm.card": "1",
      "api.alsa.pcm.stream": "playback",
      "audio.channels": "2",
      "audio.position": [
        "FL",
        "FR"
      ],
      "device.routes": "1",
      "alsa.mixer_device": "_ucm0003.hw:Dock",
      "alsa.resolution_bits": "24",
      "device.api": "alsa",
      "device.class": "monitor",
      "alsa.class": "generic",
      "alsa.subclass": "generic-mix",
      "alsa.name": "USB Audio",
      "alsa.id": "USB Audio",
      "alsa.subdevice": "0",
      "alsa.subdevice_name": "subdevice #0",
      "alsa.device": "0",
      "alsa.card": "1",
      "alsa.card_name": "WD15 Dock",
      "alsa.long_card_name": "Dell-WD15-Dock",
      "alsa.driver_name": "snd_usb_audio",
      "device.profile.name": "HiFi: hw:Dock: sink",
      "device.profile.description": "Headphones",
      "card.profile.device": "1",
      "device.id": "68",
      "factory.name": "api.alsa.pcm.sink",
      "priority.driver": "680",
      "priority.session": "680",
      "media.class": "Audio/Sink",
      "node.nick": "WD15 Dock",
      "node.name": "alsa_output.usb-Generic_USB_Audio_200810111001-00.HiFi__hw_Dock__sink",
      "device.description": "USB Audio",
      "device.icon_name": "audio-card",
      "device.bus": "usb",
      "device.bus_path": "pci-0000:0c:00.0-usb-0:1.5:1.0",
      "node.pause-on-idle": "false",
      "factory.id": "18",
      "clock.quantum-limit": "8192",
      "client.id": "32",
      "node.driver": "true",
      "factory.mode": "merge",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "object.id": "71",
      "object.serial": "127",
      "node.max-latency": "16384/48000",
      "device.enum.api": "udev",
      "api.alsa.card": "1",
      "api.alsa.card.name": "WD15 Dock",
      "api.alsa.card.longname": "Dell-WD15-Dock",
      "device.profile-set": "dell-dock-tb16-usb-audio.conf",
      "device.plugged.usec": "9673039371",
      "sysfs.path": "/sys/devices/pci0000:00/0000:00:1d.0/0000:04:00.0/0000:05:01.0/0000:07:00.0/0000:08:04.0/0000:0a:00.0/0000:0b:01.0/0000:0c:00.0/usb3/3-1/3-1.5/3-1.5:1.0/sound/card1",
      "device.bus-id": "usb-Generic_USB_Audio_200810111001-00",
      "device.subsystem": "sound",
      "device.vendor.id": "0x0bda",
      "device.vendor.name": "Realtek Semiconductor Corp.",
      "device.product.id": "0x4014",
      "device.product.name": "USB Audio",
      "device.serial": "Generic_USB_Audio_200810111001",
      "device.name": "alsa_card.usb-Generic_USB_Audio_200810111001-00",
      "device.nick": "WD15 Dock",
      "api.alsa.use-acp": "true",
      "api.acp.auto-profile": "false",
      "api.acp.auto-port": "false",
      "api.dbus.ReserveDevice1": "Audio1",
      "device.string": "1"
    },
    "Formats": [
      "pcm"
    ]
  },
  "Source #128": {
    "State": "RUNNING",
    "Name": "alsa_input.usb-Generic_USB_Audio_200810111001-00.HiFi__hw_Dock__source",
    "Description": "USB Audio Headset Microphone",
    "Driver": "PipeWire",
    "Sample Specification": {
      "name": "s24le",
      "sampleSize": 24,
      "samplingRate": 48000,
      "endianess": "Little",
      "dataType": "Signed Integer",
      "channelCount": 2
    },
    "Channel Map": [
      "front-left",
      "front-right"
    ],
    "Owner Module": "4294967295",
    "Mute": "no",
    "Volume": {
      "channels": {
        "front-left": {
          "raw": 46260,
          "percent": 71,
          "decibels": -9.08
        },
        "front-right": {
          "raw": 46260,
          "percent": 71,
          "decibels": -9.08
        }
      },
      "balance": "0.00"
    },
    "Base Volume": {
      "raw": 20724,
      "percent": 32,
      "decibels": -30
    },
    "Monitor of Sink": "n/a",
    "Latency": {
      "actual": 0,
      "configured": 0
    },
    "Flags": [
      "HARDWARE",
      "HW_MUTE_CTRL",
      "HW_VOLUME_CTRL",
      "DECIBEL_VOLUME",
      "LATENCY"
    ],
    "Properties": {
      "object.path": "alsa:pcm:1:hw:Dock:capture",
      "api.alsa.path": "hw:Dock",
      "api.alsa.open.ucm": "true",
      "api.alsa.pcm.card": "1",
      "api.alsa.pcm.stream": "capture",
      "audio.channels": "2",
      "audio.position": [
        "FL",
        "FR"
      ],
      "device.routes": "1",
      "alsa.mixer_device": "_ucm0003.hw:Dock",
      "alsa.resolution_bits": "24",
      "device.api": "alsa",
      "device.class": "sound",
      "alsa.class": "generic",
      "alsa.subclass": "generic-mix",
      "alsa.name": "USB Audio",
      "alsa.id": "USB Audio",
      "alsa.subdevice": "0",
      "alsa.subdevice_name": "subdevice #0",
      "alsa.device": "0",
      "alsa.card": "1",
      "alsa.card_name": "WD15 Dock",
      "alsa.long_card_name": "Dell-WD15-Dock",
      "alsa.driver_name": "snd_usb_audio",
      "device.profile.name": "HiFi: hw:Dock: source",
      "device.profile.description": "Headset Microphone",
      "card.profile.device": "2",
      "device.id": "68",
      "factory.name": "api.alsa.pcm.source",
      "priority.driver": "1680",
      "priority.session": "1680",
      "media.class": "Audio/Source",
      "node.nick": "WD15 Dock",
      "node.name": "alsa_input.usb-Generic_USB_Audio_200810111001-00.HiFi__hw_Dock__source",
      "device.description": "USB Audio",
      "device.icon_name": "audio-input-microphone",
      "device.bus": "usb",
      "device.bus_path": "pci-0000:0c:00.0-usb-0:1.5:1.0",
      "node.pause-on-idle": "false",
      "factory.id": "18",
      "clock.quantum-limit": "8192",
      "client.id": "32",
      "node.driver": "true",
      "factory.mode": "split",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "object.id": "72",
      "object.serial": "128",
      "node.max-latency": "16384/48000",
      "device.enum.api": "udev",
      "api.alsa.card": "1",
      "api.alsa.card.name": "WD15 Dock",
      "api.alsa.card.longname": "Dell-WD15-Dock",
      "device.profile-set": "dell-dock-tb16-usb-audio.conf",
      "device.plugged.usec": "9673039371",
      "sysfs.path": "/sys/devices/pci0000:00/0000:00:1d.0/0000:04:00.0/0000:05:01.0/0000:07:00.0/0000:08:04.0/0000:0a:00.0/0000:0b:01.0/0000:0c:00.0/usb3/3-1/3-1.5/3-1.5:1.0/sound/card1",
      "device.bus-id": "usb-Generic_USB_Audio_200810111001-00",
      "device.subsystem": "sound",
      "device.vendor.id": "0x0bda",
      "device.vendor.name": "Realtek Semiconductor Corp.",
      "device.product.id": "0x4014",
      "device.product.name": "USB Audio",
      "device.serial": "Generic_USB_Audio_200810111001",
      "device.name": "alsa_card.usb-Generic_USB_Audio_200810111001-00",
      "device.nick": "WD15 Dock",
      "api.alsa.use-acp": "true",
      "api.acp.auto-profile": "false",
      "api.acp.auto-port": "false",
      "api.dbus.ReserveDevice1": "Audio1",
      "device.string": "1"
    },
    "Ports": {
      "[In] Headset": {
        "name": "Headset Microphone",
        "info": {
          "type": "Headset",
          "priority": 100,
          "availability group": "Headset Mic",
          "available": "yes"
        }
      }
    },
    "Active Port": "[In] Headset",
    "Formats": [
      "pcm"
    ]
  },
  "Source #547": {
    "State": "RUNNING",
    "Name": "alsa_output.pci-0000_00_1f.3.analog-stereo.monitor",
    "Description": "Monitor of Built-in Audio Analog Stereo",
    "Driver": "PipeWire",
    "Sample Specification": {
      "name": "s32le",
      "sampleSize": 32,
      "samplingRate": 48000,
      "endianess": "Little",
      "dataType": "Signed Integer",
      "channelCount": 2
    },
    "Channel Map": [
      "front-left",
      "front-right"
    ],
    "Owner Module": "4294967295",
    "Mute": "no",
    "Volume": {
      "channels": {
        "front-left": {
          "raw": 65536,
          "percent": 100,
          "decibels": 0
        },
        "front-right": {
          "raw": 65536,
          "percent": 100,
          "decibels": 0
        }
      },
      "balance": "0.00"
    },
    "Base Volume": {
      "raw": 65536,
      "percent": 100,
      "decibels": 0
    },
    "Monitor of Sink": "alsa_output.pci-0000_00_1f.3.analog-stereo",
    "Latency": {
      "actual": 0,
      "configured": 0
    },
    "Flags": [
      "HARDWARE",
      "DECIBEL_VOLUME",
      "LATENCY"
    ],
    "Properties": {
      "object.path": "alsa:pcm:0:front:0:playback",
      "api.alsa.path": "front:0",
      "api.alsa.pcm.card": "0",
      "api.alsa.pcm.stream": "playback",
      "audio.channels": "2",
      "audio.position": [
        "FL",
        "FR"
      ],
      "device.routes": "2",
      "alsa.resolution_bits": "16",
      "device.api": "alsa",
      "device.class": "monitor",
      "alsa.class": "generic",
      "alsa.subclass": "generic-mix",
      "alsa.name": "ALC3271 Analog",
      "alsa.id": "ALC3271 Analog",
      "alsa.subdevice": "0",
      "alsa.subdevice_name": "subdevice #0",
      "alsa.device": "0",
      "alsa.card": "0",
      "alsa.card_name": "HDA Intel PCH",
      "alsa.long_card_name": "HDA Intel PCH at 0xec510000 irq 153",
      "alsa.driver_name": "snd_hda_intel",
      "device.profile.name": "analog-stereo",
      "device.profile.description": "Analog Stereo",
      "card.profile.device": "8",
      "device.id": "40",
      "factory.name": "api.alsa.pcm.sink",
      "priority.driver": "1009",
      "priority.session": "1009",
      "media.class": "Audio/Sink",
      "node.nick": "HDA Intel PCH",
      "node.name": "alsa_output.pci-0000_00_1f.3.analog-stereo",
      "device.description": "Built-in Audio",
      "device.icon_name": "audio-card-analog",
      "device.bus": "pci",
      "device.bus_path": "pci-0000:00:1f.3",
      "device.form_factor": "internal",
      "node.pause-on-idle": "false",
      "factory.id": "18",
      "clock.quantum-limit": "8192",
      "client.id": "32",
      "node.driver": "true",
      "factory.mode": "merge",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "object.id": "187",
      "object.serial": "547",
      "node.max-latency": "16384/48000",
      "device.enum.api": "udev",
      "api.alsa.card": "0",
      "api.alsa.card.name": "HDA Intel PCH",
      "api.alsa.card.longname": "HDA Intel PCH at 0xec510000 irq 153",
      "device.plugged.usec": "22073351",
      "sysfs.path": "/sys/devices/pci0000:00/0000:00:1f.3/sound/card0",
      "device.subsystem": "sound",
      "device.vendor.id": "0x8086",
      "device.vendor.name": "Intel Corporation",
      "device.product.id": "0xa171",
      "device.product.name": "CM238 HD Audio Controller",
      "device.name": "alsa_card.pci-0000_00_1f.3",
      "device.nick": "HDA Intel PCH",
      "api.alsa.use-acp": "true",
      "api.acp.auto-profile": "false",
      "api.acp.auto-port": "false",
      "api.dbus.ReserveDevice1": "Audio0",
      "device.string": "0"
    },
    "Formats": [
      "pcm"
    ]
  },
  "Source #688": {
    "State": "RUNNING",
    "Name": "alsa_output.usb-Behringer_FLOW_8_05-FF-01-01-73-71-00.Direct__hw_F8__sink.monitor",
    "Description": "Monitor of FLOW 8 Direct FLOW 8",
    "Driver": "PipeWire",
    "Sample Specification": {
      "name": "s32le",
      "sampleSize": 32,
      "samplingRate": 48000,
      "endianess": "Little",
      "dataType": "Signed Integer",
      "channelCount": 4
    },
    "Channel Map": [
      "front-left",
      "front-right",
      "rear-left",
      "rear-right"
    ],
    "Owner Module": "4294967295",
    "Mute": "no",
    "Volume": {
      "channels": {
        "front-left": {
          "raw": 65536,
          "percent": 100,
          "decibels": 0
        },
        "front-right": {
          "raw": 65536,
          "percent": 100,
          "decibels": 0
        },
        "rear-left": {
          "raw": 65536,
          "percent": 100,
          "decibels": 0
        },
        "rear-right": {
          "raw": 65536,
          "percent": 100,
          "decibels": 0
        }
      },
      "balance": "0.00"
    },
    "Base Volume": {
      "raw": 65536,
      "percent": 100,
      "decibels": 0
    },
    "Monitor of Sink": "alsa_output.usb-Behringer_FLOW_8_05-FF-01-01-73-71-00.Direct__hw_F8__sink",
    "Latency": {
      "actual": 0,
      "configured": 0
    },
    "Flags": [
      "HARDWARE",
      "DECIBEL_VOLUME",
      "LATENCY"
    ],
    "Properties": {
      "object.path": "alsa:pcm:2:hw:F8:playback",
      "api.alsa.path": "hw:F8",
      "api.alsa.open.ucm": "true",
      "api.alsa.pcm.card": "2",
      "api.alsa.pcm.stream": "playback",
      "audio.channels": "4",
      "audio.position": [
        "FL",
        "FR",
        "RL",
        "RR"
      ],
      "device.routes": "1",
      "alsa.mixer_device": "_ucm0004.hw:F8",
      "alsa.resolution_bits": "32",
      "device.api": "alsa",
      "device.class": "monitor",
      "alsa.class": "generic",
      "alsa.subclass": "generic-mix",
      "alsa.name": "USB Audio",
      "alsa.id": "USB Audio",
      "alsa.subdevice": "0",
      "alsa.subdevice_name": "subdevice #0",
      "alsa.device": "0",
      "alsa.card": "2",
      "alsa.card_name": "FLOW 8",
      "alsa.long_card_name": "Behringer FLOW 8 at usb-0000:00:14.0-2, high speed",
      "alsa.driver_name": "snd_usb_audio",
      "device.profile.name": "Direct: hw:F8: sink",
      "device.profile.description": "Direct FLOW 8",
      "card.profile.device": "0",
      "device.id": "217",
      "factory.name": "api.alsa.pcm.sink",
      "priority.driver": "872",
      "priority.session": "872",
      "media.class": "Audio/Sink",
      "node.nick": "FLOW 8",
      "node.name": "alsa_output.usb-Behringer_FLOW_8_05-FF-01-01-73-71-00.Direct__hw_F8__sink",
      "device.description": "FLOW 8",
      "device.icon_name": "audio-card",
      "device.bus": "usb",
      "device.bus_path": "pci-0000:00:14.0-usb-0:2:1.0",
      "node.pause-on-idle": "false",
      "factory.id": "18",
      "clock.quantum-limit": "8192",
      "client.id": "32",
      "node.driver": "true",
      "factory.mode": "merge",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "object.id": "205",
      "object.serial": "688",
      "node.max-latency": "16384/48000",
      "device.enum.api": "udev",
      "api.alsa.card": "2",
      "api.alsa.card.name": "FLOW 8",
      "api.alsa.card.longname": "Behringer FLOW 8 at usb-0000:00:14.0-2, high speed",
      "device.plugged.usec": "29743386072",
      "sysfs.path": "/sys/devices/pci0000:00/0000:00:14.0/usb1/1-2/1-2:1.0/sound/card2",
      "device.bus-id": "usb-Behringer_FLOW_8_05-FF-01-01-73-71-00",
      "device.subsystem": "sound",
      "device.vendor.id": "0x1397",
      "device.vendor.name": "BEHRINGER International GmbH",
      "device.product.id": "0x050c",
      "device.product.name": "FLOW 8",
      "device.serial": "Behringer_FLOW_8_05-FF-01-01-73-71",
      "device.name": "alsa_card.usb-Behringer_FLOW_8_05-FF-01-01-73-71-00",
      "device.nick": "FLOW 8",
      "api.alsa.use-acp": "true",
      "api.acp.auto-profile": "false",
      "api.acp.auto-port": "false",
      "api.dbus.ReserveDevice1": "Audio2",
      "device.string": "2"
    },
    "Formats": [
      "pcm"
    ]
  },
  "Source #689": {
    "State": "RUNNING",
    "Name": "alsa_input.usb-Behringer_FLOW_8_05-FF-01-01-73-71-00.Direct__hw_F8__source",
    "Description": "FLOW 8 Direct FLOW 8",
    "Driver": "PipeWire",
    "Sample Specification": {
      "name": "s32le",
      "sampleSize": 32,
      "samplingRate": 48000,
      "endianess": "Little",
      "dataType": "Signed Integer",
      "channelCount": 0
    },
    "Channel Map": [
      "aux0",
      "aux1",
      "aux2",
      "aux3",
      "aux4",
      "aux5",
      "aux6",
      "aux7",
      "aux8",
      "aux9"
    ],
    "Owner Module": "4294967295",
    "Mute": "no",
    "Volume": {
      "channels": {
        "aux0": {
          "raw": 48287,
          "percent": 74,
          "decibels": -7.96
        },
        "aux1": {
          "raw": 48287,
          "percent": 74,
          "decibels": -7.96
        },
        "aux2": {
          "raw": 48287,
          "percent": 74,
          "decibels": -7.96
        },
        "aux3": {
          "raw": 48287,
          "percent": 74,
          "decibels": -7.96
        },
        "aux4": {
          "raw": 48287,
          "percent": 74,
          "decibels": -7.96
        },
        "aux5": {
          "raw": 48287,
          "percent": 74,
          "decibels": -7.96
        },
        "aux6": {
          "raw": 48287,
          "percent": 74,
          "decibels": -7.96
        },
        "aux7": {
          "raw": 48287,
          "percent": 74,
          "decibels": -7.96
        },
        "aux8": {
          "raw": 48287,
          "percent": 74,
          "decibels": -7.96
        },
        "aux9": {
          "raw": 48287,
          "percent": 74,
          "decibels": -7.96
        }
      },
      "balance": "0.00"
    },
    "Base Volume": {
      "raw": 65536,
      "percent": 100,
      "decibels": 0
    },
    "Monitor of Sink": "n/a",
    "Latency": {
      "actual": 0,
      "configured": 0
    },
    "Flags": [
      "HARDWARE",
      "DECIBEL_VOLUME",
      "LATENCY"
    ],
    "Properties": {
      "object.path": "alsa:pcm:2:hw:F8:capture",
      "api.alsa.path": "hw:F8",
      "api.alsa.open.ucm": "true",
      "api.alsa.pcm.card": "2",
      "api.alsa.pcm.stream": "capture",
      "audio.channels": "10",
      "audio.position": [
        "AUX0",
        "AUX1",
        "AUX2",
        "AUX3",
        "AUX4",
        "AUX5",
        "AUX6",
        "AUX7",
        "AUX8",
        "AUX9"
      ],
      "device.routes": "1",
      "alsa.mixer_device": "_ucm0004.hw:F8",
      "alsa.resolution_bits": "32",
      "device.api": "alsa",
      "device.class": "sound",
      "alsa.class": "generic",
      "alsa.subclass": "generic-mix",
      "alsa.name": "USB Audio",
      "alsa.id": "USB Audio",
      "alsa.subdevice": "0",
      "alsa.subdevice_name": "subdevice #0",
      "alsa.device": "0",
      "alsa.card": "2",
      "alsa.card_name": "FLOW 8",
      "alsa.long_card_name": "Behringer FLOW 8 at usb-0000:00:14.0-2, high speed",
      "alsa.driver_name": "snd_usb_audio",
      "device.profile.name": "Direct: hw:F8: source",
      "device.profile.description": "Direct FLOW 8",
      "card.profile.device": "1",
      "device.id": "217",
      "factory.name": "api.alsa.pcm.source",
      "priority.driver": "1872",
      "priority.session": "1872",
      "media.class": "Audio/Source",
      "node.nick": "FLOW 8",
      "node.name": "alsa_input.usb-Behringer_FLOW_8_05-FF-01-01-73-71-00.Direct__hw_F8__source",
      "device.description": "FLOW 8",
      "device.icon_name": "audio-input-microphone",
      "device.bus": "usb",
      "device.bus_path": "pci-0000:00:14.0-usb-0:2:1.0",
      "node.pause-on-idle": "false",
      "factory.id": "18",
      "clock.quantum-limit": "8192",
      "client.id": "32",
      "node.driver": "true",
      "factory.mode": "split",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "object.id": "207",
      "object.serial": "689",
      "node.max-latency": "16384/48000",
      "device.enum.api": "udev",
      "api.alsa.card": "2",
      "api.alsa.card.name": "FLOW 8",
      "api.alsa.card.longname": "Behringer FLOW 8 at usb-0000:00:14.0-2, high speed",
      "device.plugged.usec": "29743386072",
      "sysfs.path": "/sys/devices/pci0000:00/0000:00:14.0/usb1/1-2/1-2:1.0/sound/card2",
      "device.bus-id": "usb-Behringer_FLOW_8_05-FF-01-01-73-71-00",
      "device.subsystem": "sound",
      "device.vendor.id": "0x1397",
      "device.vendor.name": "BEHRINGER International GmbH",
      "device.product.id": "0x050c",
      "device.product.name": "FLOW 8",
      "device.serial": "Behringer_FLOW_8_05-FF-01-01-73-71",
      "device.name": "alsa_card.usb-Behringer_FLOW_8_05-FF-01-01-73-71-00",
      "device.nick": "FLOW 8",
      "api.alsa.use-acp": "true",
      "api.acp.auto-profile": "false",
      "api.acp.auto-port": "false",
      "api.dbus.ReserveDevice1": "Audio2",
      "device.string": "2"
    },
    "Ports": {
      "[In] Direct": {
        "name": "Direct FLOW 8",
        "info": {
          "type": "Unknown",
          "priority": 1000,
          "available": "unknown"
        }
      }
    },
    "Active Port": "[In] Direct",
    "Formats": [
      "pcm"
    ]
  },
  "Sink Input #69": {
    "Driver": "PipeWire",
    "Owner Module": "n/a",
    "Client": "68",
    "Sink": "547",
    "Sample Specification": {
      "name": "s16le",
      "sampleSize": 16,
      "samplingRate": 44100,
      "endianess": "Little",
      "dataType": "Signed Integer",
      "channelCount": 1
    },
    "Channel Map": "mono",
    "Format": {
      "type": "pcm",
      "format.sample_format": "s16le",
      "format.rate": 44100,
      "format.channels": 1,
      "format.channel_map": "mono"
    },
    "Corked": "no",
    "Mute": "no",
    "Volume": {
      "raw": null,
      "percent": 100,
      "decibels": 0,
      "balance 0.00": {}
    },
    "Buffer Latency": "0 usec",
    "Sink Latency": "0 usec",
    "Resample method": "PipeWire",
    "Properties": {
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "speech-dispatcher-espeak-ng",
      "application.process.id": "8574",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "sd_espeak-ng",
      "application.language": "C",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "pulse.min.req": "1024/48000",
      "pulse.min.quantum": "1024/48000",
      "media.name": "playback",
      "node.rate": "1/44100",
      "node.latency": "941/44100",
      "stream.is-live": "true",
      "node.name": "speech-dispatcher-espeak-ng",
      "node.autoconnect": "true",
      "node.want-driver": "true",
      "media.class": "Stream/Output/Audio",
      "adapt.follower.spa-node": "",
      "object.register": "false",
      "factory.id": "6",
      "clock.quantum-limit": "8192",
      "factory.mode": "split",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "client.id": "50",
      "object.id": "51",
      "object.serial": "69",
      "pulse.attr.maxlength": "4194304",
      "pulse.attr.tlength": "5646",
      "pulse.attr.prebuf": "3766",
      "pulse.attr.minreq": "1882",
      "module-stream-restore.id": "sink-input-by-application-name:speech-dispatcher-espeak-ng"
    }
  },
  "Sink Input #75": {
    "Driver": "PipeWire",
    "Owner Module": "n/a",
    "Client": "74",
    "Sink": "547",
    "Sample Specification": {
      "name": "s16le",
      "sampleSize": 16,
      "samplingRate": 44100,
      "endianess": "Little",
      "dataType": "Signed Integer",
      "channelCount": 1
    },
    "Channel Map": "mono",
    "Format": {
      "type": "pcm",
      "format.sample_format": "s16le",
      "format.rate": 44100,
      "format.channels": 1,
      "format.channel_map": "mono"
    },
    "Corked": "no",
    "Mute": "no",
    "Volume": {
      "raw": null,
      "percent": 100,
      "decibels": 0,
      "balance 0.00": {}
    },
    "Buffer Latency": "0 usec",
    "Sink Latency": "0 usec",
    "Resample method": "PipeWire",
    "Properties": {
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "speech-dispatcher-dummy",
      "application.process.id": "8581",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "sd_dummy",
      "application.language": "C",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "pulse.min.req": "1024/48000",
      "pulse.min.quantum": "1024/48000",
      "media.name": "playback",
      "node.rate": "1/44100",
      "node.latency": "941/44100",
      "stream.is-live": "true",
      "node.name": "speech-dispatcher-dummy",
      "node.autoconnect": "true",
      "node.want-driver": "true",
      "media.class": "Stream/Output/Audio",
      "adapt.follower.spa-node": "",
      "object.register": "false",
      "factory.id": "6",
      "clock.quantum-limit": "8192",
      "factory.mode": "split",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "client.id": "56",
      "object.id": "57",
      "object.serial": "75",
      "pulse.attr.maxlength": "4194304",
      "pulse.attr.tlength": "5646",
      "pulse.attr.prebuf": "3766",
      "pulse.attr.minreq": "1882",
      "module-stream-restore.id": "sink-input-by-application-name:speech-dispatcher-dummy"
    }
  },
  "Source Output #172": {
    "Driver": "PipeWire",
    "Owner Module": "n/a",
    "Client": "171",
    "Source": "126",
    "Sample Specification": {
      "name": "float32le",
      "sampleSize": 32,
      "samplingRate": 25,
      "endianess": "Little",
      "dataType": "Float",
      "channelCount": 1
    },
    "Channel Map": "mono",
    "Format": {
      "type": "pcm",
      "format.sample_format": "float32le",
      "format.rate": 25,
      "format.channels": 1,
      "format.channel_map": "mono"
    },
    "Corked": "no",
    "Mute": "no",
    "Volume": {
      "raw": null,
      "percent": 100,
      "decibels": 0,
      "balance 0.00": {}
    },
    "Buffer Latency": "0 usec",
    "Source Latency": "0 usec",
    "Resample method": "PipeWire",
    "Properties": {
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "PulseAudio Volume Control",
      "application.id": "org.PulseAudio.pavucontrol",
      "application.icon_name": "audio-card",
      "application.version": "5.0",
      "application.process.id": "27961",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "pavucontrol",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "media.name": "Peak detect",
      "node.rate": "1/25",
      "node.latency": "1/25",
      "stream.monitor": "true",
      "node.target": "66",
      "target.object": "126",
      "stream.is-live": "true",
      "node.name": "PulseAudio Volume Control",
      "node.autoconnect": "true",
      "node.want-driver": "true",
      "node.dont-reconnect": "true",
      "media.class": "Stream/Input/Audio",
      "resample.peaks": "true",
      "channelmix.normalize": "true",
      "adapt.follower.spa-node": "",
      "object.register": "false",
      "factory.id": "6",
      "clock.quantum-limit": "8192",
      "factory.mode": "merge",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "client.id": "81",
      "object.id": "82",
      "object.serial": "172",
      "pulse.attr.maxlength": "4194304",
      "pulse.attr.fragsize": "4",
      "module-stream-restore.id": "source-output-by-application-id:org.PulseAudio.pavucontrol"
    }
  },
  "Source Output #173": {
    "Driver": "PipeWire",
    "Owner Module": "n/a",
    "Client": "171",
    "Source": "127",
    "Sample Specification": {
      "name": "float32le",
      "sampleSize": 32,
      "samplingRate": 25,
      "endianess": "Little",
      "dataType": "Float",
      "channelCount": 1
    },
    "Channel Map": "mono",
    "Format": {
      "type": "pcm",
      "format.sample_format": "float32le",
      "format.rate": 25,
      "format.channels": 1,
      "format.channel_map": "mono"
    },
    "Corked": "no",
    "Mute": "no",
    "Volume": {
      "raw": null,
      "percent": 100,
      "decibels": 0,
      "balance 0.00": {}
    },
    "Buffer Latency": "0 usec",
    "Source Latency": "0 usec",
    "Resample method": "PipeWire",
    "Properties": {
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "PulseAudio Volume Control",
      "application.id": "org.PulseAudio.pavucontrol",
      "application.icon_name": "audio-card",
      "application.version": "5.0",
      "application.process.id": "27961",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "pavucontrol",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "media.name": "Peak detect",
      "node.rate": "1/25",
      "node.latency": "1/25",
      "stream.monitor": "true",
      "node.target": "71",
      "target.object": "127",
      "stream.is-live": "true",
      "node.name": "PulseAudio Volume Control",
      "node.autoconnect": "true",
      "node.want-driver": "true",
      "node.dont-reconnect": "true",
      "media.class": "Stream/Input/Audio",
      "resample.peaks": "true",
      "channelmix.normalize": "true",
      "adapt.follower.spa-node": "",
      "object.register": "false",
      "factory.id": "6",
      "clock.quantum-limit": "8192",
      "factory.mode": "merge",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "client.id": "81",
      "object.id": "83",
      "object.serial": "173",
      "pulse.attr.maxlength": "4194304",
      "pulse.attr.fragsize": "4",
      "module-stream-restore.id": "source-output-by-application-id:org.PulseAudio.pavucontrol"
    }
  },
  "Source Output #174": {
    "Driver": "PipeWire",
    "Owner Module": "n/a",
    "Client": "171",
    "Source": "128",
    "Sample Specification": {
      "name": "float32le",
      "sampleSize": 32,
      "samplingRate": 25,
      "endianess": "Little",
      "dataType": "Float",
      "channelCount": 1
    },
    "Channel Map": "mono",
    "Format": {
      "type": "pcm",
      "format.sample_format": "float32le",
      "format.rate": 25,
      "format.channels": 1,
      "format.channel_map": "mono"
    },
    "Corked": "no",
    "Mute": "no",
    "Volume": {
      "raw": null,
      "percent": 100,
      "decibels": 0,
      "balance 0.00": {}
    },
    "Buffer Latency": "0 usec",
    "Source Latency": "0 usec",
    "Resample method": "PipeWire",
    "Properties": {
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "PulseAudio Volume Control",
      "application.id": "org.PulseAudio.pavucontrol",
      "application.icon_name": "audio-card",
      "application.version": "5.0",
      "application.process.id": "27961",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "pavucontrol",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "media.name": "Peak detect",
      "node.rate": "1/25",
      "node.latency": "1/25",
      "stream.monitor": "true",
      "node.target": "72",
      "target.object": "128",
      "stream.is-live": "true",
      "node.name": "PulseAudio Volume Control",
      "node.autoconnect": "true",
      "node.want-driver": "true",
      "node.dont-reconnect": "true",
      "media.class": "Stream/Input/Audio",
      "resample.peaks": "true",
      "channelmix.normalize": "true",
      "adapt.follower.spa-node": "",
      "object.register": "false",
      "factory.id": "6",
      "clock.quantum-limit": "8192",
      "factory.mode": "merge",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "client.id": "81",
      "object.id": "84",
      "object.serial": "174",
      "pulse.attr.maxlength": "4194304",
      "pulse.attr.fragsize": "4",
      "module-stream-restore.id": "source-output-by-application-id:org.PulseAudio.pavucontrol"
    }
  },
  "Source Output #564": {
    "Driver": "PipeWire",
    "Owner Module": "n/a",
    "Client": "171",
    "Source": "547",
    "Sample Specification": {
      "name": "float32le",
      "sampleSize": 32,
      "samplingRate": 25,
      "endianess": "Little",
      "dataType": "Float",
      "channelCount": 1
    },
    "Channel Map": "mono",
    "Format": {
      "type": "pcm",
      "format.sample_format": "float32le",
      "format.rate": 25,
      "format.channels": 1,
      "format.channel_map": "mono"
    },
    "Corked": "no",
    "Mute": "no",
    "Volume": {
      "raw": null,
      "percent": 100,
      "decibels": 0,
      "balance 0.00": {}
    },
    "Buffer Latency": "0 usec",
    "Source Latency": "0 usec",
    "Resample method": "PipeWire",
    "Properties": {
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "PulseAudio Volume Control",
      "application.id": "org.PulseAudio.pavucontrol",
      "application.icon_name": "audio-card",
      "application.version": "5.0",
      "application.process.id": "27961",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "pavucontrol",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "media.name": "Peak detect",
      "node.rate": "1/25",
      "node.latency": "1/25",
      "stream.monitor": "true",
      "node.target": "187",
      "target.object": "547",
      "stream.is-live": "true",
      "node.name": "PulseAudio Volume Control",
      "node.autoconnect": "true",
      "node.want-driver": "true",
      "node.dont-reconnect": "true",
      "media.class": "Stream/Input/Audio",
      "resample.peaks": "true",
      "channelmix.normalize": "true",
      "adapt.follower.spa-node": "",
      "object.register": "false",
      "factory.id": "6",
      "clock.quantum-limit": "8192",
      "factory.mode": "merge",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "client.id": "81",
      "object.id": "211",
      "object.serial": "564",
      "pulse.attr.maxlength": "4194304",
      "pulse.attr.fragsize": "4",
      "module-stream-restore.id": "source-output-by-application-id:org.PulseAudio.pavucontrol"
    }
  },
  "Source Output #571": {
    "Driver": "PipeWire",
    "Owner Module": "n/a",
    "Client": "171",
    "Source": "4294967295",
    "Sample Specification": {
      "name": "float32le",
      "sampleSize": 32,
      "samplingRate": 25,
      "endianess": "Little",
      "dataType": "Float",
      "channelCount": 1
    },
    "Channel Map": "mono",
    "Format": {
      "type": "pcm",
      "format.sample_format": "float32le",
      "format.rate": 25,
      "format.channels": 1,
      "format.channel_map": "mono"
    },
    "Corked": "no",
    "Mute": "no",
    "Volume": {
      "raw": null,
      "percent": 100,
      "decibels": 0,
      "balance 0.00": {}
    },
    "Buffer Latency": "0 usec",
    "Source Latency": "0 usec",
    "Resample method": "PipeWire",
    "Properties": {
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "PulseAudio Volume Control",
      "application.id": "org.PulseAudio.pavucontrol",
      "application.icon_name": "audio-card",
      "application.version": "5.0",
      "application.process.id": "27961",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "pavucontrol",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "media.name": "Peak detect",
      "node.rate": "1/25",
      "node.latency": "1/25",
      "stream.monitor": "true",
      "node.target": "51",
      "target.object": "69",
      "stream.is-live": "true",
      "node.name": "PulseAudio Volume Control",
      "node.autoconnect": "true",
      "node.want-driver": "true",
      "node.dont-reconnect": "true",
      "media.class": "Stream/Input/Audio",
      "resample.peaks": "true",
      "channelmix.normalize": "true",
      "adapt.follower.spa-node": "",
      "object.register": "false",
      "factory.id": "6",
      "clock.quantum-limit": "8192",
      "factory.mode": "merge",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "client.id": "81",
      "object.id": "116",
      "object.serial": "571",
      "pulse.attr.maxlength": "4194304",
      "pulse.attr.fragsize": "4",
      "module-stream-restore.id": "source-output-by-application-id:org.PulseAudio.pavucontrol"
    }
  },
  "Source Output #572": {
    "Driver": "PipeWire",
    "Owner Module": "n/a",
    "Client": "171",
    "Source": "4294967295",
    "Sample Specification": {
      "name": "float32le",
      "sampleSize": 32,
      "samplingRate": 25,
      "endianess": "Little",
      "dataType": "Float",
      "channelCount": 1
    },
    "Channel Map": "mono",
    "Format": {
      "type": "pcm",
      "format.sample_format": "float32le",
      "format.rate": 25,
      "format.channels": 1,
      "format.channel_map": "mono"
    },
    "Corked": "no",
    "Mute": "no",
    "Volume": {
      "raw": null,
      "percent": 100,
      "decibels": 0,
      "balance 0.00": {}
    },
    "Buffer Latency": "0 usec",
    "Source Latency": "0 usec",
    "Resample method": "PipeWire",
    "Properties": {
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "PulseAudio Volume Control",
      "application.id": "org.PulseAudio.pavucontrol",
      "application.icon_name": "audio-card",
      "application.version": "5.0",
      "application.process.id": "27961",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "pavucontrol",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "media.name": "Peak detect",
      "node.rate": "1/25",
      "node.latency": "1/25",
      "stream.monitor": "true",
      "node.target": "57",
      "target.object": "75",
      "stream.is-live": "true",
      "node.name": "PulseAudio Volume Control",
      "node.autoconnect": "true",
      "node.want-driver": "true",
      "node.dont-reconnect": "true",
      "media.class": "Stream/Input/Audio",
      "resample.peaks": "true",
      "channelmix.normalize": "true",
      "adapt.follower.spa-node": "",
      "object.register": "false",
      "factory.id": "6",
      "clock.quantum-limit": "8192",
      "factory.mode": "merge",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "client.id": "81",
      "object.id": "85",
      "object.serial": "572",
      "pulse.attr.maxlength": "4194304",
      "pulse.attr.fragsize": "4",
      "module-stream-restore.id": "source-output-by-application-id:org.PulseAudio.pavucontrol"
    }
  },
  "Source Output #708": {
    "Driver": "PipeWire",
    "Owner Module": "n/a",
    "Client": "171",
    "Source": "688",
    "Sample Specification": {
      "name": "float32le",
      "sampleSize": 32,
      "samplingRate": 25,
      "endianess": "Little",
      "dataType": "Float",
      "channelCount": 1
    },
    "Channel Map": "mono",
    "Format": {
      "type": "pcm",
      "format.sample_format": "float32le",
      "format.rate": 25,
      "format.channels": 1,
      "format.channel_map": "mono"
    },
    "Corked": "no",
    "Mute": "no",
    "Volume": {
      "raw": null,
      "percent": 100,
      "decibels": 0,
      "balance 0.00": {}
    },
    "Buffer Latency": "0 usec",
    "Source Latency": "0 usec",
    "Resample method": "PipeWire",
    "Properties": {
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "PulseAudio Volume Control",
      "application.id": "org.PulseAudio.pavucontrol",
      "application.icon_name": "audio-card",
      "application.version": "5.0",
      "application.process.id": "27961",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "pavucontrol",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "media.name": "Peak detect",
      "node.rate": "1/25",
      "node.latency": "1/25",
      "stream.monitor": "true",
      "node.target": "205",
      "target.object": "688",
      "stream.is-live": "true",
      "node.name": "PulseAudio Volume Control",
      "node.autoconnect": "true",
      "node.want-driver": "true",
      "node.dont-reconnect": "true",
      "media.class": "Stream/Input/Audio",
      "resample.peaks": "true",
      "channelmix.normalize": "true",
      "adapt.follower.spa-node": "",
      "object.register": "false",
      "factory.id": "6",
      "clock.quantum-limit": "8192",
      "factory.mode": "merge",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "client.id": "81",
      "object.id": "159",
      "object.serial": "708",
      "pulse.attr.maxlength": "4194304",
      "pulse.attr.fragsize": "4",
      "module-stream-restore.id": "source-output-by-application-id:org.PulseAudio.pavucontrol"
    }
  },
  "Source Output #721": {
    "Driver": "PipeWire",
    "Owner Module": "n/a",
    "Client": "171",
    "Source": "689",
    "Sample Specification": {
      "name": "float32le",
      "sampleSize": 32,
      "samplingRate": 25,
      "endianess": "Little",
      "dataType": "Float",
      "channelCount": 1
    },
    "Channel Map": "mono",
    "Format": {
      "type": "pcm",
      "format.sample_format": "float32le",
      "format.rate": 25,
      "format.channels": 1,
      "format.channel_map": "mono"
    },
    "Corked": "no",
    "Mute": "no",
    "Volume": {
      "raw": null,
      "percent": 100,
      "decibels": 0,
      "balance 0.00": {}
    },
    "Buffer Latency": "0 usec",
    "Source Latency": "0 usec",
    "Resample method": "PipeWire",
    "Properties": {
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "PulseAudio Volume Control",
      "application.id": "org.PulseAudio.pavucontrol",
      "application.icon_name": "audio-card",
      "application.version": "5.0",
      "application.process.id": "27961",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "pavucontrol",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "media.name": "Peak detect",
      "node.rate": "1/25",
      "node.latency": "1/25",
      "stream.monitor": "true",
      "node.target": "207",
      "target.object": "689",
      "stream.is-live": "true",
      "node.name": "PulseAudio Volume Control",
      "node.autoconnect": "true",
      "node.want-driver": "true",
      "node.dont-reconnect": "true",
      "media.class": "Stream/Input/Audio",
      "resample.peaks": "true",
      "channelmix.normalize": "true",
      "adapt.follower.spa-node": "",
      "object.register": "false",
      "factory.id": "6",
      "clock.quantum-limit": "8192",
      "factory.mode": "merge",
      "audio.adapt.follower": "",
      "library.name": "audioconvert/libspa-audioconvert",
      "client.id": "81",
      "object.id": "198",
      "object.serial": "721",
      "pulse.attr.maxlength": "4194304",
      "pulse.attr.fragsize": "4",
      "module-stream-restore.id": "source-output-by-application-id:org.PulseAudio.pavucontrol"
    }
  },
  "Client #31": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3061",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "31",
      "object.serial": "31",
      "config.prefix": "media-session.d",
      "config.name": "media-session.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "application.name": "pipewire-media-session",
      "application.process.binary": "pipewire-media-session",
      "application.language": "en_US.UTF-8",
      "application.process.id": "3061",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "window.x11.display": ":0",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3061",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #32": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3061",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "32",
      "object.serial": "32",
      "config.prefix": "media-session.d",
      "config.name": "media-session.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "application.name": "pipewire-media-session",
      "application.process.binary": "pipewire-media-session",
      "application.language": "en_US.UTF-8",
      "application.process.id": "3061",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "window.x11.display": ":0",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3061",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #41": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "41",
      "object.serial": "41",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "application.name": "pipewire-pulse",
      "application.process.binary": "pipewire-pulse",
      "application.language": "en_US.UTF-8",
      "application.process.id": "3062",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "window.x11.display": ":0",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #47": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "46",
      "object.serial": "47",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "GNOME Shell Volume Control",
      "application.id": "org.gnome.VolumeControl",
      "application.icon_name": "multimedia-volume-control",
      "application.version": "41.9",
      "application.process.id": "2885",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "gnome-shell",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #59": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "47",
      "object.serial": "59",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "GNOME Volume Control Media Keys",
      "application.id": "org.gnome.VolumeControl",
      "application.icon_name": "multimedia-volume-control",
      "application.version": "",
      "application.process.id": "3194",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "gsd-media-keys",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #60": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "48",
      "object.serial": "60",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "Dog",
      "application.id": "dog",
      "application.icon_name": "multimedia-volume-control",
      "application.version": "41.9",
      "application.process.id": "3402",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "gjs-console",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #61": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "4040",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "49",
      "object.serial": "61",
      "pipewire.access.portal.is_portal": "true",
      "portal.monitor": "Camera",
      "log.level": "0",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "application.name": "xdg-desktop-portal",
      "application.process.binary": "xdg-desktop-portal",
      "application.language": "en_US.UTF-8",
      "application.process.id": "4040",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "window.x11.display": ":0",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-4040",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #68": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "50",
      "object.serial": "68",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "speech-dispatcher-espeak-ng",
      "application.process.id": "8574",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "sd_espeak-ng",
      "application.language": "C",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "pulse.min.req": "1024/48000",
      "pulse.min.quantum": "1024/48000",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #74": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "56",
      "object.serial": "74",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "speech-dispatcher-dummy",
      "application.process.id": "8581",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "sd_dummy",
      "application.language": "C",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "pulse.min.req": "1024/48000",
      "pulse.min.quantum": "1024/48000",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #80": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "62",
      "object.serial": "80",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.icon_name": "firefox",
      "application.name": "Firefox",
      "application.version": "107.0",
      "application.process.id": "7431",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "firefox",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #86": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "63",
      "object.serial": "86",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "ccat",
      "window.x11.display": "wayland-0",
      "window.x11.screen": "0",
      "application.process.id": "3200",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "ccat",
      "application.language": "en_US.UTF-8",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #92": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "65",
      "object.serial": "92",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "pipewire.client.access": "flatpak",
      "application.name": "Chromium input",
      "application.process.id": "123",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "foo-test",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":99.0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "flatpak"
    }
  },
  "Client #99": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "64",
      "object.serial": "99",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "pipewire.client.access": "flatpak",
      "application.name": "big coin",
      "application.process.id": "93",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "foo-test2",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":99.0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "flatpak"
    }
  },
  "Client #170": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "80",
      "object.serial": "170",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "Firefox",
      "application.process.id": "26048",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "firefox-bin",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #171": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "81",
      "object.serial": "171",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "PulseAudio Volume Control",
      "application.id": "org.PulseAudio.pavucontrol",
      "application.icon_name": "audio-card",
      "application.version": "5.0",
      "application.process.id": "27961",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "pavucontrol",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #224": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "107",
      "object.serial": "224",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "pipewire.client.access": "flatpak",
      "application.name": "Chromium input",
      "application.process.id": "172",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "teams-for-linux",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":99.0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "flatpak"
    }
  },
  "Client #460": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "218",
      "object.serial": "460",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "Chromium input",
      "application.process.id": "28428",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "chromium-browser",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #461": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "173",
      "object.serial": "461",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "Firefox",
      "application.process.id": "7431",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "firefox",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #493": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "146",
      "object.serial": "493",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "pipewire.client.access": "flatpak",
      "application.name": "Chromium input",
      "application.process.id": "470",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "signal-desktop",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":99.0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "flatpak"
    }
  },
  "Client #520": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "147",
      "object.serial": "520",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "Mutter",
      "application.process.id": "2885",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "gnome-shell",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #526": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "189",
      "object.serial": "526",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.icon_name": "footet",
      "application.name": "Footet",
      "application.version": "102.5.0",
      "application.process.id": "33761",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "footet",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #582": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "213",
      "object.serial": "582",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.icon_name": "firefox",
      "application.name": "Firefox",
      "application.version": "115.0.2",
      "application.process.id": "6994",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "firefox-bin",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #787": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "124",
      "object.serial": "787",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "pavucontrol",
      "window.x11.display": "wayland-0",
      "window.x11.screen": "0",
      "application.process.id": "27961",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "pavucontrol",
      "application.language": "en_US.UTF-8",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "unrestricted"
    }
  },
  "Client #899": {
    "Driver": "PipeWire",
    "Owner Module": "2",
    "Properties": {
      "pipewire.protocol": "protocol-native",
      "pipewire.sec.pid": "3062",
      "pipewire.sec.uid": "1000",
      "pipewire.sec.gid": "1000",
      "pipewire.sec.label": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023",
      "module.id": "2",
      "object.id": "120",
      "object.serial": "899",
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.process.id": "99492",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "pactl",
      "application.name": "pactl",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "config.name": "pipewire-pulse.conf",
      "cpu.max-align": "32",
      "default.clock.rate": "48000",
      "default.clock.quantum": "1024",
      "default.clock.min-quantum": "32",
      "default.clock.max-quantum": "2048",
      "default.clock.quantum-limit": "8192",
      "default.video.width": "640",
      "default.video.height": "480",
      "default.video.rate.num": "25",
      "default.video.rate.denom": "1",
      "log.level": "2",
      "clock.power-of-two-quantum": "true",
      "link.max-buffers": "64",
      "mem.warn-mlock": "false",
      "mem.allow-mlock": "true",
      "settings.check-quantum": "false",
      "settings.check-rate": "false",
      "core.version": "0.3.56",
      "core.name": "pipewire-fedora-3062",
      "pipewire.access": "unrestricted"
    }
  },
  "Sample #0": {
    "Name": "bell-window-system",
    "Sample Specification": {
      "name": "s16le",
      "sampleSize": 16,
      "samplingRate": 44100,
      "endianess": "Little",
      "dataType": "Signed Integer",
      "channelCount": 2
    },
    "Channel Map": [
      "front-left",
      "front-right"
    ],
    "Volume": {
      "channels": {
        "front-left": {
          "raw": 65536,
          "percent": 100,
          "decibels": 0
        },
        "front-right": {
          "raw": 65536,
          "percent": 100,
          "decibels": 0
        }
      },
      "balance": "0.00"
    },
    "Duration": "0.1s",
    "Size": "24.0 KiB",
    "Lazy": "no",
    "Filename": "n/a",
    "Properties": {
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "Mutter",
      "application.process.id": "2885",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "gnome-shell",
      "application.language": "en_US.UTF-8",
      "window.x11.display": ":0",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "event.description": "Bell event",
      "event.id": "bell-window-system",
      "media.role": "event",
      "media.name": "bell-window-system",
      "media.filename": "/usr/share//sounds/freedesktop/stereo/bell.oga"
    }
  },
  "Sample #1": {
    "Name": "audio-volume-change",
    "Sample Specification": {
      "name": "s16le",
      "sampleSize": 16,
      "samplingRate": 44100,
      "endianess": "Little",
      "dataType": "Signed Integer",
      "channelCount": 2
    },
    "Channel Map": [
      "front-left",
      "front-right"
    ],
    "Volume": {
      "channels": {
        "front-left": {
          "raw": 65536,
          "percent": 100,
          "decibels": 0
        },
        "front-right": {
          "raw": 65536,
          "percent": 100,
          "decibels": 0
        }
      },
      "balance": "0.00"
    },
    "Duration": "0.1s",
    "Size": "11.5 KiB",
    "Lazy": "no",
    "Filename": "n/a",
    "Properties": {
      "client.api": "pipewire-pulse",
      "pulse.server.type": "unix",
      "application.name": "pavucontrol",
      "window.x11.display": "wayland-0",
      "window.x11.screen": "0",
      "application.process.id": "27961",
      "application.process.user": "fedora",
      "application.process.host": "fedora",
      "application.process.binary": "pavucontrol",
      "application.language": "en_US.UTF-8",
      "application.process.machine_id": "9599fd14c9249710d83dadffdcf8f63f",
      "event.id": "audio-volume-change",
      "event.description": "Volume Control Feedback Sound",
      "media.role": "event",
      "media.name": "audio-volume-change",
      "media.filename": "/usr/share//sounds/freedesktop/stereo/audio-volume-change.oga"
    }
  },
  "Card #40": {
    "Name": "alsa_card.pci-0000_00_1f.3",
    "Driver": "alsa",
    "Owner Module": "n/a",
    "Properties": {
      "device.enum.api": "udev",
      "device.api": "alsa",
      "media.class": "Audio/Device",
      "api.alsa.path": "hw:0",
      "api.alsa.card": "0",
      "api.alsa.card.name": "HDA Intel PCH",
      "api.alsa.card.longname": "HDA Intel PCH at 0xec510000 irq 153",
      "device.plugged.usec": "22073351",
      "device.bus_path": "pci-0000:00:1f.3",
      "sysfs.path": "/sys/devices/pci0000:00/0000:00:1f.3/sound/card0",
      "device.bus": "pci",
      "device.subsystem": "sound",
      "device.vendor.id": "0x8086",
      "device.vendor.name": "Intel Corporation",
      "device.product.id": "0xa171",
      "device.product.name": "CM238 HD Audio Controller",
      "device.form_factor": "internal",
      "device.name": "alsa_card.pci-0000_00_1f.3",
      "device.description": "Built-in Audio",
      "device.nick": "HDA Intel PCH",
      "device.icon_name": "audio-card-pci",
      "api.alsa.use-acp": "true",
      "api.acp.auto-profile": "false",
      "api.acp.auto-port": "false",
      "api.dbus.ReserveDevice1": "Audio0",
      "factory.id": "14",
      "client.id": "31",
      "object.id": "40",
      "object.serial": "40",
      "object.path": "alsa:pcm:0",
      "alsa.card": "0",
      "alsa.card_name": "HDA Intel PCH",
      "alsa.long_card_name": "HDA Intel PCH at 0xec510000 irq 153",
      "alsa.driver_name": "snd_hda_intel",
      "device.string": "0"
    },
    "Profiles": {
      "off": {
        "name": "Off",
        "info": {
          "sinks": 0,
          "sources": 0,
          "priority": 0,
          "available": "yes"
        }
      },
      "output:analog-stereo+input:analog-stereo": {
        "name": "Analog Stereo Duplex",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 6565,
          "available": "yes"
        }
      },
      "output:analog-stereo": {
        "name": "Analog Stereo Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 6500,
          "available": "yes"
        }
      },
      "output:hdmi-stereo+input:analog-stereo": {
        "name": "Digital Stereo (HDMI) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 5965,
          "available": "yes"
        }
      },
      "output:hdmi-stereo": {
        "name": "Digital Stereo (HDMI) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 5900,
          "available": "yes"
        }
      },
      "output:hdmi-stereo-extra1+input:analog-stereo": {
        "name": "Digital Stereo (HDMI 2) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 5765,
          "available": "yes"
        }
      },
      "output:hdmi-stereo-extra2+input:analog-stereo": {
        "name": "Digital Stereo (HDMI 3) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 5765,
          "available": "yes"
        }
      },
      "output:hdmi-stereo-extra3+input:analog-stereo": {
        "name": "Digital Stereo (HDMI 4) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 5765,
          "available": "yes"
        }
      },
      "output:hdmi-stereo-extra4+input:analog-stereo": {
        "name": "Digital Stereo (HDMI 5) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 5765,
          "available": "yes"
        }
      },
      "output:hdmi-stereo-extra1": {
        "name": "Digital Stereo (HDMI 2) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 5700,
          "available": "yes"
        }
      },
      "output:hdmi-stereo-extra2": {
        "name": "Digital Stereo (HDMI 3) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 5700,
          "available": "yes"
        }
      },
      "output:hdmi-stereo-extra3": {
        "name": "Digital Stereo (HDMI 4) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 5700,
          "available": "yes"
        }
      },
      "output:hdmi-stereo-extra4": {
        "name": "Digital Stereo (HDMI 5) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 5700,
          "available": "yes"
        }
      },
      "output:hdmi-surround+input:analog-stereo": {
        "name": "Digital Surround 5.1 (HDMI) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 865,
          "available": "yes"
        }
      },
      "output:hdmi-surround71+input:analog-stereo": {
        "name": "Digital Surround 7.1 (HDMI) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 865,
          "available": "yes"
        }
      },
      "output:hdmi-surround": {
        "name": "Digital Surround 5.1 (HDMI) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 800,
          "available": "yes"
        }
      },
      "output:hdmi-surround71": {
        "name": "Digital Surround 7.1 (HDMI) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 800,
          "available": "yes"
        }
      },
      "output:hdmi-surround-extra1+input:analog-stereo": {
        "name": "Digital Surround 5.1 (HDMI 2) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 665,
          "available": "yes"
        }
      },
      "output:hdmi-surround71-extra1+input:analog-stereo": {
        "name": "Digital Surround 7.1 (HDMI 2) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 665,
          "available": "yes"
        }
      },
      "output:hdmi-surround-extra2+input:analog-stereo": {
        "name": "Digital Surround 5.1 (HDMI 3) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 665,
          "available": "yes"
        }
      },
      "output:hdmi-surround71-extra2+input:analog-stereo": {
        "name": "Digital Surround 7.1 (HDMI 3) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 665,
          "available": "yes"
        }
      },
      "output:hdmi-surround-extra3+input:analog-stereo": {
        "name": "Digital Surround 5.1 (HDMI 4) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 665,
          "available": "yes"
        }
      },
      "output:hdmi-surround71-extra3+input:analog-stereo": {
        "name": "Digital Surround 7.1 (HDMI 4) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 665,
          "available": "yes"
        }
      },
      "output:hdmi-surround-extra4+input:analog-stereo": {
        "name": "Digital Surround 5.1 (HDMI 5) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 665,
          "available": "yes"
        }
      },
      "output:hdmi-surround71-extra4+input:analog-stereo": {
        "name": "Digital Surround 7.1 (HDMI 5) Output + Analog Stereo Input",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 665,
          "available": "yes"
        }
      },
      "output:hdmi-surround-extra1": {
        "name": "Digital Surround 5.1 (HDMI 2) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 600,
          "available": "yes"
        }
      },
      "output:hdmi-surround71-extra1": {
        "name": "Digital Surround 7.1 (HDMI 2) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 600,
          "available": "yes"
        }
      },
      "output:hdmi-surround-extra2": {
        "name": "Digital Surround 5.1 (HDMI 3) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 600,
          "available": "yes"
        }
      },
      "output:hdmi-surround71-extra2": {
        "name": "Digital Surround 7.1 (HDMI 3) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 600,
          "available": "yes"
        }
      },
      "output:hdmi-surround-extra3": {
        "name": "Digital Surround 5.1 (HDMI 4) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 600,
          "available": "yes"
        }
      },
      "output:hdmi-surround71-extra3": {
        "name": "Digital Surround 7.1 (HDMI 4) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 600,
          "available": "yes"
        }
      },
      "output:hdmi-surround-extra4": {
        "name": "Digital Surround 5.1 (HDMI 5) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 600,
          "available": "yes"
        }
      },
      "output:hdmi-surround71-extra4": {
        "name": "Digital Surround 7.1 (HDMI 5) Output",
        "info": {
          "sinks": 1,
          "sources": 0,
          "priority": 600,
          "available": "yes"
        }
      },
      "input:analog-stereo": {
        "name": "Analog Stereo Input",
        "info": {
          "sinks": 0,
          "sources": 1,
          "priority": 65,
          "available": "yes"
        }
      },
      "pro-audio": {
        "name": "Pro Audio",
        "info": {
          "sinks": 6,
          "sources": 1,
          "priority": 1,
          "available": "yes"
        }
      }
    },
    "Active Profile": "output:analog-stereo",
    "Ports": {
      "analog-input-internal-mic": {
        "name": "Internal Microphone",
        "info": {
          "type": "Mic",
          "priority": 8900,
          "latency offset": "0",
          "availability group": "Legacy 1",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "mic",
          "port.availability-group": "Legacy 1",
          "device.icon_name": "audio-input-microphone",
          "card.profile.port": "0"
        },
        "Part of profile(s)": [
          "input:analog-stereo",
          "output:analog-stereo+input:analog-stereo",
          "output:hdmi-stereo+input:analog-stereo",
          "output:hdmi-surround+input:analog-stereo",
          "output:hdmi-surround71+input:analog-stereo",
          "output:hdmi-stereo-extra1+input:analog-stereo",
          "output:hdmi-surround-extra1+input:analog-stereo",
          "output:hdmi-surround71-extra1+input:analog-stereo",
          "output:hdmi-stereo-extra2+input:analog-stereo",
          "output:hdmi-surround-extra2+input:analog-stereo",
          "output:hdmi-surround71-extra2+input:analog-stereo",
          "output:hdmi-stereo-extra3+input:analog-stereo",
          "output:hdmi-surround-extra3+input:analog-stereo",
          "output:hdmi-surround71-extra3+input:analog-stereo",
          "output:hdmi-stereo-extra4+input:analog-stereo",
          "output:hdmi-surround-extra4+input:analog-stereo",
          "output:hdmi-surround71-extra4+input:analog-stereo"
        ]
      },
      "analog-input-headphone-mic": {
        "name": "Microphone",
        "info": {
          "type": "Mic",
          "priority": 8700,
          "latency offset": "0",
          "availability group": "Legacy 2",
          "available": "no"
        },
        "Properties": {
          "port.type": "mic",
          "port.availability-group": "Legacy 2",
          "device.icon_name": "audio-input-microphone",
          "card.profile.port": "1"
        },
        "Part of profile(s)": [
          "input:analog-stereo",
          "output:analog-stereo+input:analog-stereo",
          "output:hdmi-stereo+input:analog-stereo",
          "output:hdmi-surround+input:analog-stereo",
          "output:hdmi-surround71+input:analog-stereo",
          "output:hdmi-stereo-extra1+input:analog-stereo",
          "output:hdmi-surround-extra1+input:analog-stereo",
          "output:hdmi-surround71-extra1+input:analog-stereo",
          "output:hdmi-stereo-extra2+input:analog-stereo",
          "output:hdmi-surround-extra2+input:analog-stereo",
          "output:hdmi-surround71-extra2+input:analog-stereo",
          "output:hdmi-stereo-extra3+input:analog-stereo",
          "output:hdmi-surround-extra3+input:analog-stereo",
          "output:hdmi-surround71-extra3+input:analog-stereo",
          "output:hdmi-stereo-extra4+input:analog-stereo",
          "output:hdmi-surround-extra4+input:analog-stereo",
          "output:hdmi-surround71-extra4+input:analog-stereo"
        ]
      },
      "analog-input-headset-mic": {
        "name": "Headset Microphone",
        "info": {
          "type": "Headset",
          "priority": 8800,
          "latency offset": "0",
          "availability group": "Legacy 2",
          "available": "no"
        },
        "Properties": {
          "port.type": "headset",
          "port.availability-group": "Legacy 2",
          "device.icon_name": "audio-input-microphone",
          "card.profile.port": "2"
        },
        "Part of profile(s)": [
          "input:analog-stereo",
          "output:analog-stereo+input:analog-stereo",
          "output:hdmi-stereo+input:analog-stereo",
          "output:hdmi-surround+input:analog-stereo",
          "output:hdmi-surround71+input:analog-stereo",
          "output:hdmi-stereo-extra1+input:analog-stereo",
          "output:hdmi-surround-extra1+input:analog-stereo",
          "output:hdmi-surround71-extra1+input:analog-stereo",
          "output:hdmi-stereo-extra2+input:analog-stereo",
          "output:hdmi-surround-extra2+input:analog-stereo",
          "output:hdmi-surround71-extra2+input:analog-stereo",
          "output:hdmi-stereo-extra3+input:analog-stereo",
          "output:hdmi-surround-extra3+input:analog-stereo",
          "output:hdmi-surround71-extra3+input:analog-stereo",
          "output:hdmi-stereo-extra4+input:analog-stereo",
          "output:hdmi-surround-extra4+input:analog-stereo",
          "output:hdmi-surround71-extra4+input:analog-stereo"
        ]
      },
      "analog-output-speaker": {
        "name": "Speakers",
        "info": {
          "type": "Speaker",
          "priority": 10000,
          "latency offset": "0",
          "availability group": "Legacy 3",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "speaker",
          "port.availability-group": "Legacy 3",
          "device.icon_name": "audio-speakers",
          "card.profile.port": "3"
        },
        "Part of profile(s)": [
          "output:analog-stereo",
          "output:analog-stereo+input:analog-stereo"
        ]
      },
      "analog-output-headphones": {
        "name": "Headphones",
        "info": {
          "type": "Headphones",
          "priority": 9900,
          "latency offset": "0",
          "availability group": "Legacy 2",
          "available": "no"
        },
        "Properties": {
          "port.type": "headphones",
          "port.availability-group": "Legacy 2",
          "device.icon_name": "audio-headphones",
          "card.profile.port": "4"
        },
        "Part of profile(s)": [
          "output:analog-stereo",
          "output:analog-stereo+input:analog-stereo"
        ]
      },
      "hdmi-output-0": {
        "name": "HDMI / DisplayPort",
        "info": {
          "type": "HDMI",
          "priority": 5900,
          "latency offset": "0",
          "availability group": "Legacy 4",
          "available": "no"
        },
        "Properties": {
          "port.type": "hdmi",
          "port.availability-group": "Legacy 4",
          "device.icon_name": "video-display",
          "card.profile.port": "5"
        },
        "Part of profile(s)": [
          "output:hdmi-stereo",
          "output:hdmi-stereo+input:analog-stereo",
          "output:hdmi-surround",
          "output:hdmi-surround+input:analog-stereo",
          "output:hdmi-surround71",
          "output:hdmi-surround71+input:analog-stereo"
        ]
      },
      "hdmi-output-1": {
        "name": "HDMI / DisplayPort 2",
        "info": {
          "type": "HDMI",
          "priority": 5800,
          "latency offset": "0",
          "availability group": "Legacy 5",
          "available": "no"
        },
        "Properties": {
          "port.type": "hdmi",
          "port.availability-group": "Legacy 5",
          "device.icon_name": "video-display",
          "card.profile.port": "6"
        },
        "Part of profile(s)": [
          "output:hdmi-stereo-extra1",
          "output:hdmi-stereo-extra1+input:analog-stereo",
          "output:hdmi-surround-extra1",
          "output:hdmi-surround-extra1+input:analog-stereo",
          "output:hdmi-surround71-extra1",
          "output:hdmi-surround71-extra1+input:analog-stereo"
        ]
      },
      "hdmi-output-2": {
        "name": "HDMI / DisplayPort 3",
        "info": {
          "type": "HDMI",
          "priority": 5700,
          "latency offset": "0",
          "availability group": "Legacy 6",
          "available": "no"
        },
        "Properties": {
          "port.type": "hdmi",
          "port.availability-group": "Legacy 6",
          "device.icon_name": "video-display",
          "card.profile.port": "7"
        },
        "Part of profile(s)": [
          "output:hdmi-stereo-extra2",
          "output:hdmi-stereo-extra2+input:analog-stereo",
          "output:hdmi-surround-extra2",
          "output:hdmi-surround-extra2+input:analog-stereo",
          "output:hdmi-surround71-extra2",
          "output:hdmi-surround71-extra2+input:analog-stereo"
        ]
      },
      "hdmi-output-3": {
        "name": "HDMI / DisplayPort 4",
        "info": {
          "type": "HDMI",
          "priority": 5600,
          "latency offset": "0",
          "availability group": "Legacy 7",
          "available": "no"
        },
        "Properties": {
          "port.type": "hdmi",
          "port.availability-group": "Legacy 7",
          "device.icon_name": "video-display",
          "card.profile.port": "8"
        },
        "Part of profile(s)": [
          "output:hdmi-stereo-extra3",
          "output:hdmi-stereo-extra3+input:analog-stereo",
          "output:hdmi-surround-extra3",
          "output:hdmi-surround-extra3+input:analog-stereo",
          "output:hdmi-surround71-extra3",
          "output:hdmi-surround71-extra3+input:analog-stereo"
        ]
      },
      "hdmi-output-4": {
        "name": "HDMI / DisplayPort 5",
        "info": {
          "type": "HDMI",
          "priority": 5500,
          "latency offset": "0",
          "availability group": "Legacy 8",
          "available": "no"
        },
        "Properties": {
          "port.type": "hdmi",
          "port.availability-group": "Legacy 8",
          "device.icon_name": "video-display",
          "card.profile.port": "9"
        },
        "Part of profile(s)": [
          "output:hdmi-stereo-extra4",
          "output:hdmi-stereo-extra4+input:analog-stereo",
          "output:hdmi-surround-extra4",
          "output:hdmi-surround-extra4+input:analog-stereo",
          "output:hdmi-surround71-extra4",
          "output:hdmi-surround71-extra4+input:analog-stereo"
        ]
      }
    }
  },
  "Card #125": {
    "Name": "alsa_card.usb-Generic_USB_Audio_200810111001-00",
    "Driver": "alsa",
    "Owner Module": "n/a",
    "Properties": {
      "device.enum.api": "udev",
      "device.api": "alsa",
      "media.class": "Audio/Device",
      "api.alsa.path": "hw:1",
      "api.alsa.card": "1",
      "api.alsa.card.name": "WD15 Dock",
      "api.alsa.card.longname": "Dell-WD15-Dock",
      "device.profile-set": "dell-dock-tb16-usb-audio.conf",
      "device.plugged.usec": "9673039371",
      "device.bus_path": "pci-0000:0c:00.0-usb-0:1.5:1.0",
      "sysfs.path": "/sys/devices/pci0000:00/0000:00:1d.0/0000:04:00.0/0000:05:01.0/0000:07:00.0/0000:08:04.0/0000:0a:00.0/0000:0b:01.0/0000:0c:00.0/usb3/3-1/3-1.5/3-1.5:1.0/sound/card1",
      "device.bus-id": "usb-Generic_USB_Audio_200810111001-00",
      "device.bus": "usb",
      "device.subsystem": "sound",
      "device.vendor.id": "0x0bda",
      "device.vendor.name": "Realtek Semiconductor Corp.",
      "device.product.id": "0x4014",
      "device.product.name": "USB Audio",
      "device.serial": "Generic_USB_Audio_200810111001",
      "device.name": "alsa_card.usb-Generic_USB_Audio_200810111001-00",
      "device.description": "USB Audio",
      "device.nick": "WD15 Dock",
      "device.icon_name": "audio-card-usb",
      "api.alsa.use-acp": "true",
      "api.acp.auto-profile": "false",
      "api.acp.auto-port": "false",
      "api.dbus.ReserveDevice1": "Audio1",
      "factory.id": "14",
      "client.id": "31",
      "object.id": "68",
      "object.serial": "125",
      "object.path": "alsa:pcm:1",
      "alsa.card": "1",
      "alsa.card_name": "WD15 Dock",
      "alsa.long_card_name": "Dell-WD15-Dock",
      "alsa.driver_name": "snd_usb_audio",
      "device.string": "1"
    },
    "Profiles": {
      "off": {
        "name": "Off",
        "info": {
          "sinks": 0,
          "sources": 0,
          "priority": 0,
          "available": "yes"
        }
      },
      "HiFi": {
        "name": "Default",
        "info": {
          "sinks": 2,
          "sources": 1,
          "priority": 8000,
          "available": "yes"
        }
      }
    },
    "Active Profile": "HiFi",
    "Ports": {
      "[Out] Line": {
        "name": "Line Out",
        "info": {
          "type": "Line",
          "priority": 200,
          "latency offset": "0",
          "availability group": "Line Out",
          "available": "no"
        },
        "Properties": {
          "port.type": "line",
          "port.availability-group": "Line Out",
          "card.profile.port": "0"
        },
        "Part of profile(s)": "HiFi"
      },
      "[Out] Headphones": {
        "name": "Headphones",
        "info": {
          "type": "Headphones",
          "priority": 100,
          "latency offset": "0",
          "availability group": "Headphone",
          "available": "yes"
        },
        "Properties": {
          "port.type": "headphones",
          "port.availability-group": "Headphone",
          "card.profile.port": "1"
        },
        "Part of profile(s)": "HiFi"
      },
      "[In] Headset": {
        "name": "Headset Microphone",
        "info": {
          "type": "Headset",
          "priority": 100,
          "latency offset": "0",
          "availability group": "Headset Mic",
          "available": "yes"
        },
        "Properties": {
          "port.type": "headset",
          "port.availability-group": "Headset Mic",
          "card.profile.port": "2"
        },
        "Part of profile(s)": "HiFi"
      }
    }
  },
  "Card #687": {
    "Name": "alsa_card.usb-Behringer_FLOW_8_05-FF-01-01-73-71-00",
    "Driver": "alsa",
    "Owner Module": "n/a",
    "Properties": {
      "device.enum.api": "udev",
      "device.api": "alsa",
      "media.class": "Audio/Device",
      "api.alsa.path": "hw:2",
      "api.alsa.card": "2",
      "api.alsa.card.name": "FLOW 8",
      "api.alsa.card.longname": "Behringer FLOW 8 at usb-0000:00:14.0-2, high speed",
      "device.plugged.usec": "29743386072",
      "device.bus_path": "pci-0000:00:14.0-usb-0:2:1.0",
      "sysfs.path": "/sys/devices/pci0000:00/0000:00:14.0/usb1/1-2/1-2:1.0/sound/card2",
      "device.bus-id": "usb-Behringer_FLOW_8_05-FF-01-01-73-71-00",
      "device.bus": "usb",
      "device.subsystem": "sound",
      "device.vendor.id": "0x1397",
      "device.vendor.name": "BEHRINGER International GmbH",
      "device.product.id": "0x050c",
      "device.product.name": "FLOW 8",
      "device.serial": "Behringer_FLOW_8_05-FF-01-01-73-71",
      "device.name": "alsa_card.usb-Behringer_FLOW_8_05-FF-01-01-73-71-00",
      "device.description": "FLOW 8",
      "device.nick": "FLOW 8",
      "device.icon_name": "audio-card-usb",
      "api.alsa.use-acp": "true",
      "api.acp.auto-profile": "false",
      "api.acp.auto-port": "false",
      "api.dbus.ReserveDevice1": "Audio2",
      "factory.id": "14",
      "client.id": "31",
      "object.id": "217",
      "object.serial": "687",
      "object.path": "alsa:pcm:2",
      "alsa.card": "2",
      "alsa.card_name": "FLOW 8",
      "alsa.long_card_name": "Behringer FLOW 8 at usb-0000:00:14.0-2, high speed",
      "alsa.driver_name": "snd_usb_audio",
      "device.string": "2"
    },
    "Profiles": {
      "off": {
        "name": "Off",
        "info": {
          "sinks": 0,
          "sources": 0,
          "priority": 0,
          "available": "yes"
        }
      },
      "Direct": {
        "name": "Direct Flow8 Recording",
        "info": {
          "sinks": 1,
          "sources": 1,
          "priority": 1,
          "available": "yes"
        }
      },
      "Recording": {
        "name": "Recording Mode (4 chan output, 10 chan input)",
        "info": {
          "sinks": 2,
          "sources": 11,
          "priority": 1,
          "available": "yes"
        }
      }
    },
    "Active Profile": "Direct",
    "Ports": {
      "[Out] Direct": {
        "name": "Direct FLOW 8",
        "info": {
          "type": "Unknown",
          "priority": 1000,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "unknown",
          "card.profile.port": "0"
        },
        "Part of profile(s)": "Direct"
      },
      "[In] Direct": {
        "name": "Direct FLOW 8",
        "info": {
          "type": "Unknown",
          "priority": 1000,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "unknown",
          "card.profile.port": "1"
        },
        "Part of profile(s)": "Direct"
      },
      "[Out] Line2": {
        "name": "USB-34 L/R",
        "info": {
          "type": "Line",
          "priority": 200,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "line",
          "card.profile.port": "2"
        },
        "Part of profile(s)": "Recording"
      },
      "[Out] Line1": {
        "name": "USB-12 L/R",
        "info": {
          "type": "Line",
          "priority": 100,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "line",
          "card.profile.port": "3"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] LineMaster": {
        "name": "Master/Monitor L/R",
        "info": {
          "type": "Unknown",
          "priority": 110,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "unknown",
          "card.profile.port": "4"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Line78": {
        "name": "Line-78 L/R",
        "info": {
          "type": "Line",
          "priority": 109,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "line",
          "card.profile.port": "5"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Line56": {
        "name": "Line-56 L/R",
        "info": {
          "type": "Line",
          "priority": 108,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "line",
          "card.profile.port": "6"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Line8": {
        "name": "Line/Inst(HiZ) 8 (R)",
        "info": {
          "type": "Line",
          "priority": 107,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "line",
          "card.profile.port": "7"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Line7": {
        "name": "Line/Inst 7 (L)",
        "info": {
          "type": "Line",
          "priority": 106,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "line",
          "card.profile.port": "8"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Line6": {
        "name": "Line/Inst(HiZ) 6 (R)",
        "info": {
          "type": "Line",
          "priority": 105,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "line",
          "card.profile.port": "9"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Line5": {
        "name": "Line/Inst 5 (L)",
        "info": {
          "type": "Line",
          "priority": 104,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "line",
          "card.profile.port": "10"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Mic4": {
        "name": "Mic 4",
        "info": {
          "type": "Mic",
          "priority": 103,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "mic",
          "card.profile.port": "11"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Mic3": {
        "name": "Mic 3",
        "info": {
          "type": "Mic",
          "priority": 102,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "mic",
          "card.profile.port": "12"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Mic2": {
        "name": "Mic 2",
        "info": {
          "type": "Mic",
          "priority": 101,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "mic",
          "card.profile.port": "13"
        },
        "Part of profile(s)": "Recording"
      },
      "[In] Mic1": {
        "name": "Mic 1",
        "info": {
          "type": "Mic",
          "priority": 100,
          "latency offset": "0",
          "available": "unknown"
        },
        "Properties": {
          "port.type": "mic",
          "card.profile.port": "14"
        },
        "Part of profile(s)": "Recording"
      }
    }
  }
}
```
