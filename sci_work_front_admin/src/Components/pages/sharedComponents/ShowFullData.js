const ShowFullData = (dataObject) => {

    const formatValue = (value) => {
        if (Array.isArray(value)) {
            return `[ ${value.map(v => formatValue(v)).join(", ")} ]`
        }
        else if (typeof value === "object" && value !== null) {
            return `{ ${Object.entries(value)
                .map(([key, val]) => `${key}: ${formatValue(val)}`)
                .join(", ")} }`
        }
        else {
            return value // Keeps numbers and booleans as-is
        }
    }

    return (
        <pre>
            {Object.entries(dataObject)
                .filter(([_, value]) => value !== undefined)
                .map(([key, value]) => `${key}: ${formatValue(value)}`)
                .join("\n")}
        </pre>
    )
}

export default ShowFullData