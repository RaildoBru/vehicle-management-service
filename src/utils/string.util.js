function capitalizeFirstLetter(value) {
    if (!value) return value;

    return value.trim()
        .toLowerCase()
        .split(' ')
        .map(word =>
            word
            .split('-')
            .map(part =>
                part.charAt(0).toUpperCase() + part.slice(1)
            )
            .join('-')
        )
        .join(' ');
}

export { capitalizeFirstLetter };