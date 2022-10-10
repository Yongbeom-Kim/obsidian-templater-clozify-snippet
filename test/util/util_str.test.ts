import {getSubStringAfter, getSubStringBefore} from "../../src/util/str_utils";

test("get string after regex", () => {
    expect(getSubStringAfter("dfasafsadfs====sdfasdffasd", /====/)).toBe("sdfasdffasd");
    expect(getSubStringAfter("dfasafsadfs====sdfasdffasd", "====")).toBe("sdfasdffasd");
})

test("get string before regex", () => {
    expect(getSubStringBefore("dfasafsadfs====sdfasdffasd", /====/)).toBe("dfasafsadfs");
    expect(getSubStringBefore("dfasafsadfs====sdfasdffasd", "====")).toBe("dfasafsadfs");
})