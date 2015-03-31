declare function describe(description: string, body: () =>{ });
declare function it(description:string, body: () =>{ });
declare function expect(value: any): ExpectResult;

interface ExpectResult {
    toBe(value: any);
}