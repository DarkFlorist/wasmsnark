import bigInt from 'big-integer';
import { describe, it } from 'micro-should';
import buildInt from '../src/build_int.js';
import buildTest from '../src/build_test.js';
import buildProtoboard from '../src/protoboard.js';
import helpers from './helpers/helpers.js';
import { assert } from './test_utils.js';

describe("Basic tests for Int", () => {
    let pbInt;

    const init = async () => {
        if (pbInt) return;
        pbInt = await buildProtoboard((module) => {
            buildInt(module, 4);
            buildTest(module, "int_mul");
            buildTest(module, "int_mulOld");
        }, 32);
    };

    it("It should do a basic multiplication", async () => {
        await init();
        let c;
        const pA = pbInt.alloc();
        const pB = pbInt.alloc();
        const pC = pbInt.alloc(64);

        const values = helpers.genValues(8, false);

        for (let i=0; i<values.length; i++) {
            for (let j=0; j<values.length; j++) {
                pbInt.set(pA, values[i]);
                pbInt.set(pB, values[j]);
                // console.log(values[i].toString(16));
                // console.log(values[j].toString(16));

                pbInt.int_mul(pA, pB, pC);
                c = pbInt.get(pC, 1, 64);

                // console.log("Result: " + c.toString(16));
                // console.log("Refere: " + values[i].times(values[j]).toString(16));
                assert(c.equals(values[i].times(values[j])));

            }
        }
    });

    it("It should profile int", async () => {
        await init();
        const pA = pbInt.alloc();
        const pB = pbInt.alloc();
        const pC = pbInt.alloc(64);

        let start, end, time;

        const A = bigInt.one.shiftLeft(256).minus(1);
        const B = bigInt.one.shiftLeft(256).minus(1);

        pbInt.set(pA, A);
        pbInt.set(pB, B);

        start = new Date().getTime();
        pbInt.test_int_mul(pA, pB, pC, 50000000);
        end = new Date().getTime();
        time = end - start;

        const c1 = pbInt.get(pC, 1, 64);
        assert(c1.equals(A.times(B)));

        console.log("Mul Time (ms): " + time);

        start = new Date().getTime();
        pbInt.test_int_mulOld(pA, pB, pC, 50000000);
        end = new Date().getTime();
        time = end - start;

        const c2 = pbInt.get(pC, 1, 64);
        assert(c2.equals(A.times(B)));

        console.log("Mul Old Time (ms): " + time);

    });

});
it.runWhen(import.meta.url);
