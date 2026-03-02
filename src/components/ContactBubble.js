"use client";

import Link from "next/link";
import styles from "./ContactBubble.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ContactBubble() {
  const [hasIcon, setHasIcon] = useState(true);

  useEffect(() => {
    // feature-detect the icon in public
    fetch('/icons/Phone_icon.png', { method: 'HEAD' })
      .then((r) => setHasIcon(r.ok))
      .catch(() => setHasIcon(false));
  }, []);

  return (
    <Link href="/attention-lines" aria-label="Líneas de atención" className={styles.bubble}>
      <span className={styles.srOnly}>Ir a Líneas de Atención</span>
      {hasIcon ? (
        <Image src="/icons/Phone_icon.png" alt="phone" width={36} height={36} className={styles.icon} />
      ) : (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="12" cy="12" r="11" stroke="#0B57A4" strokeWidth="1.2" fill="#fff" />
          <path d="M8.5 10.5c1 2 2.5 3.5 4.5 4.5l1-1c.3-.3.8-.4 1.2-.2 1 .4 2.1 1.1 3.1 2.1.4.4.4 1 .1 1.4l-1 1c-.7.7-1.9.5-3.7-.5-1.8-1-3.5-2.6-4.9-4.9C6.6 9.6 6.4 8.4 7 7.7l1-1c.4-.4 1-.4 1.4-.1 1 .8 1.7 1.9 2.1 3.1.1.4 0 .9-.2 1.2l-1 1z" fill="#0B57A4" />
        </svg>
      )}
    </Link>
  );
}
