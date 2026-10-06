export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function longDateFormat(value) {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getPageNumbers(currentPage, totalPages) {
  const pages = [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  pages.push(1);

  if (currentPage > 4) {
    pages.push("...");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 3) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}

export function handleApiErrors(apiError, setError, fieldMap = {}) {
  const serverErrors = apiError?.data;

  // Network, timeout, CORS, 500 without usable data
  if (serverErrors && typeof serverErrors != "object") {
    setError("root.server", {
      type: "server",
      message: apiError?.error || "Unable to connect to the server.",
    });
  }

  console.log("serverErrors: ", serverErrors);

  Object?.entries(serverErrors).forEach(([fieldName, messages]) => {
    const formFieldName = fieldMap[fieldName] || fieldName;

    // Global backend error
    if (fieldName === "detail" || fieldName === "non_field_errors") {
      setError("root.server", {
        type: "server",
        message: Array.isArray(messages) ? messages[0] : String(messages),
      });

      return;
    }

    // Field-specific backend error
    if (Array.isArray(messages)) {
      setError(formFieldName, {
        type: "server",
        message: messages[0],
      });

      return;
    }

    if (typeof messages === "string") {
      setError(formFieldName, {
        type: "server",
        message: messages,
      });
    }
  });
}

export function formatListWithAnd(items) {
  if (!items?.length) return "";

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return items.join(" & ");
  }

  return `${items.slice(0, -1).join(", ")}, & ${items.at(-1)}`;
}

export function formatPrice(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency, // 'INR', 'USD', etc.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatAddress(a = {}) {
  const street = [a.line1, a.line2].filter(Boolean).join(", ");
  const region = [[a.city, a.state].filter(Boolean).join(", "), a.postal_code]
    .filter(Boolean)
    .join(" - ");

  return { street, region };
}
