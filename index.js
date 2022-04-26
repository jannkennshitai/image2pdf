/*
 * Copyright (c) 2022 Hiroaki Sano
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */


"use strict";

const eInput = document.getElementById("input");
const eOutput = document.getElementById("output");

eInput.addEventListener("click", onInputButtonClick, false);
eOutput.setAttribute("download", "a.pdf");

async function onInputFileChange(e){
	eOutput.textContent = "読込中";

	const files = e.target.files;

	if(eOutput.href) URL.revokeObjectURL(eOutput.href);
	eOutput.removeAttribute("href");

	const pdfDoc = await PDFLib.PDFDocument.create();
	for(let i=0, l=files.length; i<l; ++i){
		eOutput.textContent = "変換中（" + (i+1) + "/" + l + "）";

		const file = files[i];
		const buffer = await file.arrayBuffer();
		if(file.type == "image/jpeg"){
			const image = await pdfDoc.embedJpg(buffer);
			const page = pdfDoc.addPage([image.width, image.height]);
			page.drawImage(image);
		}else if(file.type == "image/png"){
			const image = await pdfDoc.embedPng(buffer);
			const page = pdfDoc.addPage([image.width, image.height]);
			page.drawImage(image);
		}
	}

	const pdfBytes = await pdfDoc.save();
	const blob = new Blob([pdfBytes.buffer], { type: "application/pdf" });

	eOutput.setAttribute("href", URL.createObjectURL(blob));
	eOutput.textContent = "a.pdf";
}

function onInputButtonClick(e){
	const eInputFile = document.createElement("input");
	eInputFile.setAttribute("type", "file");
	eInputFile.setAttribute("accept", "image/jpeg,image/png");
	eInputFile.setAttribute("multiple", "");
	eInputFile.addEventListener("change", onInputFileChange, false);
	eInputFile.click();
}
