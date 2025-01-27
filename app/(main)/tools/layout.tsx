import ActivatableLink from "@components/Specialized/ActivatableLink";
import styles from "./layout.module.scss";

export default function ToolsLayout({ children }: React.PropsWithChildren) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <nav className={styles.sidebarNav}>
          <ToolsSidebar root={sidebar} />
        </nav>
      </aside>
      <div className={styles.page}>{children}</div>
    </div>
  );
}

const sidebar: SidebarNode = {
  "Discord Tools": {
    "Server Widget Generator": "/tools/discord-server-widget",
  },
};

type SidebarNode = { [x: string]: SidebarNode | string };

function ToolsSidebar({ root }: { root: SidebarNode }) {
  return <ToolsSidebarNode node={root} />;
}
function ToolsSidebarNode({ node }: { node: SidebarNode }) {
  return (
    <ul>
      {Object.entries(node).map(([key, value]) => {
        return (
          <li key={key}>
            {typeof value === "string" ? (
              <ActivatableLink href={value}>{key}</ActivatableLink>
            ) : (
              <>
                <h3>{key}</h3>
                <ToolsSidebarNode node={value} />
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
