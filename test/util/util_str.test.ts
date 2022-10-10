import {lastPartition, partition} from "../../src/util/str_utils";

test("first partition", () => {
    expect(partition("a-b-c-d-e-f-g", "-")).toEqual({
        left: "a",
        right:"b-c-d-e-f-g"
    })

    expect(partition("asdfdfs", "-")).toEqual({
        left: "asdfdfs",
        right:""
    })
})

test("last partition", () => {
    expect(lastPartition("a-b-c-d-e-f-g", "-")).toEqual({
        left: "a-b-c-d-e-f",
        right:"g"
    })
    
    expect(lastPartition("asdfdfs", "-")).toEqual({
        left: "",
        right:"asdfdfs"
    })
})