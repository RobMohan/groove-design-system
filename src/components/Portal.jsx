import { createPortal } from 'react-dom';

/**
 * Portal — render children into another part of the DOM (document.body by default).
 *
 * Overlays (Modal, Drawer, Popover, Tooltip, Command Palette) portal to the body
 * so they escape parent `overflow`/`transform`/`z-index` stacking contexts and can
 * sit above everything else on the named z-index scale.
 *
 * @param {React.ReactNode} children - content to portal
 * @param {HTMLElement} [container] - target node (defaults to document.body)
 */
const Portal = ({ children, container }) => {
  if (typeof document === 'undefined') return null;
  const target = container || document.body;
  return createPortal(children, target);
};

export default Portal;
