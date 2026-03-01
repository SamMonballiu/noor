// import {
//   ContextMenuTrigger,
//   ContextMenu as RctxContextMenu,
//   ContextMenuItem,
// } from "rctx-contextmenu";
import { useMemo } from "react";
import { ContextMenu as RdxContextMenu } from "radix-ui";
import cx from "classnames";

import styles from "./ContextMenu.module.scss";

export type ContextHandler<T> = {
  icon?: React.ReactNode;
  label: string;
  disabled?: (context: T) => boolean;
  onClick?: (context: T) => void;
};

interface Props<T> extends React.PropsWithChildren {
  context: T;
  getId: (context: T) => string;
  handlers?: ContextHandler<T>[];
}

export const ContextMenu = <T,>({
  context,
  handlers = [],
  children,
  getId,
}: Props<T>) => {
  return (
    <>
      <RdxContextMenu.Root>
        <RdxContextMenu.Trigger disabled={handlers.length === 0}>
          {children}
        </RdxContextMenu.Trigger>

        <RdxContextMenu.Portal>
          <RdxContextMenu.Content className={styles.content}>
            {handlers.map((h, idx) => (
              <RdxContextMenu.Item
                disabled={h.disabled?.(context)}
                key={`${getId(context)}_${idx}`}
                className={cx(styles.item, {
                  [styles.disabled]: h.disabled?.(context),
                })}
                onClick={() =>
                  h.disabled?.(context) ? undefined : h.onClick?.(context)
                }
              >
                {h.icon}
                {h.label}
              </RdxContextMenu.Item>
            ))}
          </RdxContextMenu.Content>
        </RdxContextMenu.Portal>
      </RdxContextMenu.Root>
    </>
  );
};
