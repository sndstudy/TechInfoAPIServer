import { DemoClass } from "./demo";

test("hoge", () => {
    const demo: DemoClass = new DemoClass();
    expect(demo.sum(2, 4)).toBe(6);
});
