"use client";

import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { ResumeView } from "./ResumeView";

/**
 * Single résumé modal mounted once at the page root. Any trigger (nav link,
 * hero button) opens it by dispatching a window "open-resume" event — no prop
 * drilling or shared context needed.
 */
export function ResumeModalHost() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener("open-resume", openIt);
    return () => window.removeEventListener("open-resume", openIt);
  }, []);

  return (
    <Modal open={open} onClose={() => setOpen(false)} label="Résumé">
      <ResumeView />
    </Modal>
  );
}
