function getCssClass(s: string) {
	return s.trim().replace(/\s+/g, '-').replace(/-+/g, '-').toLowerCase();
}

export default getCssClass;