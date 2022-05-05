"use strict";
// This plugintext:Font will open a window to prompt the user to enter a number, and
//loadFont().then create that many rectangles on the screen.
//
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// This shows the HTML page in "ui.html".
// figma.showUI(__html__);
// // Calls to "parent.postMessage" from within the HTML page will trigger this
// // callback. The callback will be passed the "pluginMessage" property of the
// // posted message.
// figma.ui.onmessage = msg => {
//   // One way of distinguishing between different types of messages sent from
//   // your HTML page is to use an object with a "type" property like this.
//   if (msg.type === 'create-rectangles') {
//     // const nodes: SceneNode[] = [];
//     // for (let i = 0; i < msg.count; i++) {
//     //   const rect = figma.createRectangle();
//     //   rect.x = i * 150;
//     //   rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
//     //   figma.currentPage.appendChild(rect);
//     //   nodes.push(rect);
//     // }
//     // figma.currentPage.selection = nodes;
//     // figma.viewport.scrollAndZoomIntoView(nodes);
//   }
//   // Make sure to close the plugin when you're done. Otherwise the plugin will
//   // keep running, which shows the cancel button at the bottom of the screen.
//   figma.closePlugin();
// };
figma.on("run", () => {
    figma.skipInvisibleInstanceChildren = true;
    const selected = figma.currentPage.selection.filter((node) => node.type === "TEXT");
    const allText = figma.currentPage.findAllWithCriteria({
        types: ["TEXT"],
    });
    const hasText = allText.length > 0;
    const isActive = selected.length > 0;
    const runPlugin = () => {
        const loadFont = (array) => __awaiter(void 0, void 0, void 0, function* () {
            for (const node of array) {
                yield figma.loadFontAsync(node.fontName);
                console.log("success");
            }
        });
        const loopNodes = (array) => __awaiter(void 0, void 0, void 0, function* () {
            yield loadFont(array);
            for (const node of array) {
                let unit = node.lineHeight.unit;
                let isAuto = unit === "AUTO";
                let isPixels = unit === "PIXELS";
                let isPercent = unit === "PERCENT";
                if (isAuto || isPixels) {
                    node.lineHeight = { value: 100, unit: "PERCENT" };
                }
                if (isPercent) {
                    node.lineHeight = { unit: "AUTO" };
                }
            }
            figma.notify("Success!");
            figma.closePlugin();
        });
        const notSelected = (array) => __awaiter(void 0, void 0, void 0, function* () {
            yield loadFont(array);
            for (const node of array) {
                node.lineHeight = { value: 100, unit: "PERCENT" };
            }
            figma.notify("Changed all text line-height");
            figma.closePlugin();
        });
        isActive ? loopNodes(selected) : notSelected(allText);
    };
    const close = () => {
        figma.notify("No text found");
        figma.closePlugin();
    };
    hasText ? runPlugin() : close();
});
