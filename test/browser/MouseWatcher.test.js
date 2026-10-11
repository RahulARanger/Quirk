/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Suite, assertThat} from "../TestUtil.js"
import {eventPosRelativeTo} from "../../src/browser/MouseWatcher.js"

let suite = new Suite("MouseWatcher");

suite.test("eventPosRelativeToIncludesScrollOffset", () => {
    let element = {
        scrollLeft: 12,
        scrollTop: 34,
        getBoundingClientRect: () => ({left: 100, top: 200})
    };

    let pos = eventPosRelativeTo({clientX: 150, clientY: 250}, element);
    assertThat(pos.x).isEqualTo(62);
    assertThat(pos.y).isEqualTo(84);
});
