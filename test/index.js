import { it } from 'micro-should';

import './bn128.js';
import './f1.js';
import './fft.js';
import './groth16.js';
import './int.js';
import './tomcook.js';

it.runWhen(import.meta.url);
