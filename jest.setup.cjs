const React = require("react");

require("@testing-library/jest-dom");

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    const { src, alt, ...rest } = props || {};
    const resolvedSrc = typeof src === "string" ? src : src?.src || "";
    return React.createElement("img", { src: resolvedSrc, alt: alt || "", ...rest });
  },
}));
