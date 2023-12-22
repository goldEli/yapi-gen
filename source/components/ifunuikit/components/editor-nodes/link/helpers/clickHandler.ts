import { getAttributes } from "@tiptap/core";
import { MarkType } from "prosemirror-model";
import { Plugin, PluginKey } from "prosemirror-state";

type ClickHandlerOptions = {
  type: MarkType;
};

export function clickHandler(options: ClickHandlerOptions): Plugin {
  return new Plugin({
    key: new PluginKey("handleClickLink"),
    props: {
      markViews: {
        link: (mark, view, inline) => {
          const linkWrap = document.createElement("a");
          linkWrap.href = mark.attrs.href;

          const content = document.createElement("span");

          linkWrap.appendChild(content);

          return {
            dom: linkWrap,
            contentDOM: content,
          };
        },
      },
      handleClick: (view, pos, event) => {
        const attrs = getAttributes(view.state, options.type.name);
        const link = (event.target as HTMLElement)?.closest("a");

        // if (link && attrs.href) {
        //   window.open(attrs.href, attrs.target);

        //   return true;
        // }

        return false;
      },
      handleDOMEvents: {
        mouseover() {
        
          return false;
        },
      },
    },
  });
}
