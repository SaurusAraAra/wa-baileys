

import * as whatsapp_rust_bridge_1 from 'whatsapp-rust-bridge';
/**
 * LT Hash is a summation based hash algorithm that maintains the integrity of a piece of data
 * over a series of mutations. You can add/remove mutations and it'll return a hash equal to
 * if the same series of mutations was made sequentially.
 */
const LT_HASH_ANTI_TAMPERING = new whatsapp_rust_bridge_1.LTHashAntiTampering();

export { LT_HASH_ANTI_TAMPERING };
