import { Panel } from "../../components/Panel.tsx";

import { useAuth } from "../../hooks/useAuth.tsx";

export const Account = () => {
  const { signOut } = useAuth();

  return (
    <Panel>
      <button
        type="button"
        className="btn"
        onClick={async () => await signOut()}
      >
        Sign out
      </button>
      <button
        type="button"
        className="btn"
        onClick={async () => await signOut()}
      >
        Delete account
      </button>
    </Panel>
  );
};
