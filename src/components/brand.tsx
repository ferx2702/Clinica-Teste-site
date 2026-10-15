import { site } from "@/lib/site";
export function Brand() {
  return (
    <span className="brand" translate="no">
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      {site.name}
      <span className="brand-dot">.</span>
    </span>
  );
}
