module zip {

    export module fs {

        export class FS {
            root: ZipDirectoryEntry;
            exportBlob(onend: (blob: any) =>any, onprogress?: (index:number, maxIndex:number) =>any, onerror?: () =>any);            
        }

        export class ZipDirectoryEntry {
            addText(name: string, text: string);
            addHttpContent(name: string, URL: string, size?: number, useRangeHeader?: bool): ZipFileEntry;
            addBlob(name:string,blob: any);
        }

        export class ZipFileEntry {

        }
    }

    var workerScriptsPath: string;
    
    export class Writer {
        close(callback:(blob:any)=>any);
        add(filename: string, reader: Reader, onsuccess?:()=>any, onprogress?:(currentIndex: number, totalIndex:number)=>any, onerror?:(error:string)=>any);
    }

    export class Reader {
    }
    
    export class BlobWriter extends Writer {
    }

    export class TextReader extends Reader {
        constructor (text: string);
    }

    export class ZipWriter extends Writer {
        constructor ();        
    }

    export function createWriter(writer: any, callback: (writer: Writer)=>any, onerror?:(error:string)=>any): any;
}


