/**
 * Breadcrumb utilities for generating dynamic breadcrumb labels
 */

// Mapping of route segments to readable labels
export const breadcrumbLabelMap: Record<string, string> = {
  dashboard: "Dashboard",
  settings: "Settings",
  staffs: "Staffs",
  create: "Create Staff",
  update: "Edit Staff",
  password: "Change Password",
  profile: "Profile",
};

/**
 * Get a readable label for a route segment
 * @param segment - The route segment (e.g., 'dashboard', 'create', or a UUID)
 * @param previousSegment - The previous segment for context
 * @returns A readable label
 */
export function getSegmentLabel(
  segment: string,
  previousSegment?: string
): string {
  // Check if it's a mapped label
  if (breadcrumbLabelMap[segment]) {
    return breadcrumbLabelMap[segment];
  }

  // Check if it's a dynamic ID (UUID, Firebase UID, or number)
  const isUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      segment
    );
  const isNumber = /^\d+$/.test(segment);
  const isFirebaseUID = /^[a-zA-Z0-9]{20,}$/.test(segment); // Firebase UIDs are typically 28 chars, alphanumeric

  if (isUUID || isNumber || isFirebaseUID) {
    // Return generic label based on previous segment
    if (previousSegment === "staffs") {
      return "Staff Details";
    }
    return "Details";
  }

  // Fallback: capitalize first letter and replace hyphens/underscores with spaces
  return segment
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Build breadcrumb items from pathname
 * @param pathname - The current pathname (e.g., '/admin/staffs/create')
 * @param role - The current role from params
 * @returns Array of breadcrumb items with label and href
 */
export function buildBreadcrumbItems(pathname: string, role: string) {
  // Remove leading/trailing slashes and split
  const segments = pathname.split("/").filter(Boolean);

  // Remove the role from segments if it's the first one
  const pathSegments = segments[0] === role ? segments.slice(1) : segments;

  // Always start with the role as the first breadcrumb
  const items = [
    {
      label: role.charAt(0).toUpperCase() + role.slice(1),
      href: `/${role}/dashboard`,
      isCurrentPage: false,
    },
  ];

  // Build breadcrumb items for each segment
  let currentPath = `/${role}`;

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLastSegment = index === pathSegments.length - 1;
    const previousSegment = index > 0 ? pathSegments[index - 1] : undefined;

    items.push({
      label: getSegmentLabel(segment, previousSegment),
      href: currentPath,
      isCurrentPage: isLastSegment,
    });
  });

  return items;
}
