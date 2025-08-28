// import React, { useEffect, useState } from "react";
// import Factors from "../dropdown/Factors";
// import Pulse from "../loader/Pulse";
// import { parseCode } from "../../shared/splitter/treeSitterUtil";
// import Function from "../dropdown/Function";
// import { postMessage } from "./../../shared/vscode/vscode-api";

// type Method = {
//   name: string;
//   full_content: string;
// };

// type ClassDetails = {
//   class_name: string;
//   full_content: string;
//   methods: Method[];
// };

// type FileInfo = {
//   filePath: string;
//   fileContent: string;
//   fileName: string;
//   classDetail: ClassDetails[];
//   methodDetail: Method[];
// };

// interface FooterProps {
//   selectedFactor: string;
//   planDetails: any;
//   setSelectedFactor: (factor: string) => void;
//   fileInfo?: FileInfo | null;
//   setFileInfo: React.Dispatch<React.SetStateAction<FileInfo | null>>;
//   handleSubmit: any;
//   load: boolean;
// }

// type ExtractedCodeResult = {
//   extractedCode: string;
//   context?: boolean;
//   analysis_code_name: string;
// };

// const Footer: React.FC<FooterProps> = ({
//   selectedFactor,
//   planDetails,
//   fileInfo,
//   handleSubmit,
//   setFileInfo,
//   setSelectedFactor,
//   load,
// }) => {
//   const [SelectedLines, setSelectedLines] = useState<{
//     code: string;
//     startLine: number;
//     endLine: number;
//   }>({
//     code: "",
//     startLine: 0,
//     endLine: 0,
//   });

//   const [selectedFunction, setSelectedFunction] = useState<{
//     type: string;
//     name: string;
//     className: string;
//   }>({ type: "Entire File", name: "Entire File", className: "" });

//   // Request file information from VS Code extension on component mount
//   useEffect(() => {
//     requestFileInfo();
//     window.addEventListener("message", handleMessage);
//     return () => {
//       window.removeEventListener("message", handleMessage);
//     };
//   }, []);

//   const requestFileInfo = () => {
//     postMessage({
//       command: "requestFileInfo",
//     });
//   };

//   const handleMessage = async (event: MessageEvent) => {
//     const message = event.data;

//     switch (message.command) {
//       case "fileContentResponse":
//         await handleFileContentResponse(message);
//         break;
//       case "selectedText":
//         handleSelectedText(message);
//         break;
//       default:
//         // Handle unexpected commands or ignore them
//         break;
//     }
//   };

//   const handleFileContentResponse = async (message: any) => {
//     const { filePath, fileContent, language } = message;
//     if (
//       typeof filePath === "string" &&
//       filePath.trim() &&
//       typeof fileContent === "string" &&
//       fileContent.trim()
//     ) {
//       const normalizedPath = filePath.replace(/\\/g, "/");
//       const fileName = normalizedPath.split("/").pop() || "";

//       try {
//         const res = await parseCode(fileContent, language);
//         setFileInfo({
//           filePath,
//           fileContent,
//           fileName,
//           classDetail: res?.class_details || [],
//           methodDetail: res?.methods || [],
//         });
//       } catch (error) {
//         setFileInfo({
//           filePath,
//           fileContent,
//           fileName,
//           classDetail: [],
//           methodDetail: [],
//         });
//       }
//     }
//   };

//   const handleSelectedText = (message: any) => {
//     if (!message.code) {
//       setSelectedLines({ code: "", startLine: 0, endLine: 0 });
//     } else {
//       setSelectedLines(() => ({
//         code: message.code,
//         startLine: message.startLine,
//         endLine: message.endLine,
//       }));
//     }
//   };

//   /**
//    * This helper can be called anytime the user picks a new function/class/selection.
//    * If it's NOT the entire file, force the factor to "power_analysis"
//    */
//   useEffect(() => {
//     if (selectedFunction.type !== "Entire File") {
//       setSelectedFactor("power_analysis");
//     }
//   }, [selectedFunction, setSelectedFactor]);

//   const handleEntireFile = (fileInfo: FileInfo): ExtractedCodeResult => {
//     return {
//       extractedCode: fileInfo.fileContent,
//       context: false,
//       analysis_code_name: "",
//     };
//   };

//   const handleSelectedLine = (SelectedLines: {
//     code: string;
//     startLine: number;
//     endLine: number;
//   }): ExtractedCodeResult => {
//     return {
//       extractedCode: SelectedLines.code,
//       analysis_code_name: `Lines ${SelectedLines.startLine} - ${SelectedLines.endLine}`,
//     };
//   };

//   const handleClass = (
//     fileInfo: FileInfo,
//     className: string
//   ): ExtractedCodeResult => {
//     const selectedClass = fileInfo?.classDetail?.find(
//       (cls) => cls.class_name === className
//     );
//     return selectedClass
//       ? { extractedCode: selectedClass?.full_content, analysis_code_name: "" }
//       : { extractedCode: "", analysis_code_name: "" };
//   };

//   const handleFunctionInClass = (
//     fileInfo: FileInfo,
//     className: string,
//     functionName: string
//   ): ExtractedCodeResult => {
//     const selectedClass = fileInfo?.classDetail?.find(
//       (cls) => cls.class_name === className
//     );
//     const method = selectedClass
//       ? selectedClass?.methods.find((method) => method.name === functionName)
//       : null;
//     return method
//       ? { extractedCode: method?.full_content, analysis_code_name: method.name }
//       : { extractedCode: "", analysis_code_name: "" };
//   };

//   const handleStandaloneFunction = (
//     fileInfo: FileInfo,
//     functionName: string
//   ): ExtractedCodeResult => {
//     const method = fileInfo?.methodDetail?.find(
//       (method) => method.name === functionName
//     );
//     return method
//       ? { extractedCode: method.full_content, analysis_code_name: method.name }
//       : { extractedCode: "", analysis_code_name: "" };
//   };

//   const handleContentExtraction = (): void => {
//     if (!fileInfo) return;

//     let extractedCode = "";
//     let context = true;
//     let analysis_code_name = "";

//     switch (selectedFunction.type) {
//       case "Entire File":
//         ({ extractedCode, context = false } = handleEntireFile(fileInfo));
//         break;
//       case "Selected Line":
//         ({ extractedCode, analysis_code_name = "" } =
//           handleSelectedLine(SelectedLines));
//         break;
//       case "Class":
//         ({ extractedCode } = handleClass(fileInfo, selectedFunction.className));
//         break;
//       case "Function":
//         if (selectedFunction.className) {
//           ({ extractedCode, analysis_code_name } = handleFunctionInClass(
//             fileInfo,
//             selectedFunction.className,
//             selectedFunction.name
//           ));
//         } else {
//           ({ extractedCode, analysis_code_name } = handleStandaloneFunction(
//             fileInfo,
//             selectedFunction.name
//           ));
//         }
//         break;
//       default:
//         break;
//     }

//     handleSubmit(
//       extractedCode || "",
//       context || false,
//       analysis_code_name || ""
//     );
//   };

//   // We define "single mode" as anything that isn't "Entire File"
//   const isSingleMode = selectedFunction.type === "Entire File" ? false : true;

//   return (
//     <div className="w-full fixed bottom-0">
//       <div className="w-full">
//         <Function
//           fileInfo={fileInfo}
//           selectedLines={SelectedLines}
//           selectedFunction={selectedFunction}
//           setSelectedFunction={setSelectedFunction}
//         />
//       </div>

//       {/* Pass isSingleMode into Factors */}
//       <div className="w-full">
//         <Factors
//           selectedFactor={selectedFactor}
//           planDetails={planDetails}
//           setSelectedFactor={setSelectedFactor}
//           isSingleMode={isSingleMode}
//         />
//       </div>

//       <div className="flex flex-col border-t border-gray-300 p-4  w-full bg-[var(--vscode-editor-background)]">
//         <div className="flex justify-between items-center gap-2">
//           <span
//             className={`border text-center max-w-[200px] px-5 border-gray-300 rounded-3xl gap-5 w-fit py-2 truncate-text `}
//           >
//             <span className="text-vscode-editor-fg ">
//               {fileInfo?.fileName || "No code file is currently open"}
//             </span>
//           </span>
//           <button
//             className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-600"
//             onClick={handleContentExtraction}
//             disabled={load}
//           >
//             {load ? <Pulse /> : "Submit"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Footer;
