"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ComponentType } from "react";

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function DeferredEnquiry() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const focusFormRef = useRef(false);
  const restoreContactRef = useRef(false);
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [Form, setForm] = useState<ComponentType | null>(null);

  function loadForm(focusForm = false) {
    if (focusForm) focusFormRef.current = true;
    if (loadingRef.current || Form) return;
    const bounds = containerRef.current?.getBoundingClientRect();
    restoreContactRef.current = window.location.hash === "#contact" && !!bounds &&
      bounds.top < window.innerHeight && bounds.bottom > 0;
    loadingRef.current = true;
    setLoading(true);
    setFailed(false);
    void import("./enquiry-section").then(({ EnquirySection }) => {
      setForm(() => EnquirySection);
    }).catch(() => {
      setFailed(true);
      focusFormRef.current = false;
    }).finally(() => {
      loadingRef.current = false;
      setLoading(false);
    });
  }

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      loadForm();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && !node.contains(document.activeElement)) {
        observer.disconnect();
        loadForm();
      }
    }, { rootMargin: "800px" });
    observer.observe(node);
    return () => observer.disconnect();
    // Load only when this boundary first approaches the viewport.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Form && focusFormRef.current) {
      focusFormRef.current = false;
      containerRef.current?.querySelector<HTMLInputElement>("#enquiry-name")?.focus();
    }
    if (Form && restoreContactRef.current && window.location.hash === "#contact") {
      restoreContactRef.current = false;
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }, [Form]);

  return (
    <div id="contact" ref={containerRef} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget) && !Form && !failed) loadForm();
    }}>
      {Form ? <Form /> : (
        <section className="chapter section-shell enquiry-chapter enquiry-deferred" aria-labelledby="enquiry-fallback-heading">
          <div className="enquiry-layout">
            <div className="enquiry-intro">
              <p className="chapter-index">05 / Connect</p>
              <h2 id="enquiry-fallback-heading" className="enquiry-heading">Let’s start a conversation.</h2>
              <p className="enquiry-lead">Tell us what you’re looking for, and we’ll connect you with the right team within Goodman Group.</p>
            </div>
            <div className="enquiry-card">
              <p className="enquiry-lead">Contact us at <a className="enquiry-mailto-link" href="mailto:goodman@goodmangoc.com">goodman@goodmangoc.com</a>.</p>
              {ready && <button type="button" className="enquiry-submit-btn" aria-disabled={loading} onClick={() => loadForm(true)}>{failed ? "Try loading the enquiry form again" : loading ? "Loading enquiry form…" : "Open enquiry form"}</button>}
              {failed && <p role="alert">The enquiry form could not be loaded. Please try again or email us directly.</p>}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
