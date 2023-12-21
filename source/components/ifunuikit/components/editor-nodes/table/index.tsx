/* eslint-disable @typescript-eslint/naming-convention */
import Table from "@tiptap/extension-table";
import { Node, ReactNodeViewRenderer } from "@tiptap/react";
import View from "./view";

const CustomTable = Table.extend({
  // addNodeView() {
  //   return ReactNodeViewRenderer(View);
  // },
});

export default CustomTable;
