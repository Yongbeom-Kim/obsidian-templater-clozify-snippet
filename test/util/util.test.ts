import {getSubStringAfter, getSubStringBefore} from "../../src/util/utils";

test("get string after regex", () => {
    expect(getSubStringAfter("dfasafsadfs====sdfasdffasd", /====/)).toBe("sdfasdffasd");
})

test("get string before regex", () => {
    expect(getSubStringBefore("dfasafsadfs====sdfasdffasd", /====/)).toBe("dfasafsadfs");
})