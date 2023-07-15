#!/usr/bin/env node

import { _pactlObj } from './index.mjs';

const args = process.argv.slice(2);

async function main() {
    try {
        const pactlObj = await _pactlObj(args);
        const pactlJson = JSON.stringify(pactlObj, null, '    ');
        console.log(pactlJson);
    } catch (e) {
        console.error(e)
    }
}

main().catch(console.error);