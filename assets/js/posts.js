// Remove attribute to show all items.
window.ivent.on(document, 'pvs.pagination.rendered', ({ data }) => {
	data.insertTo.removeAttribute('data-posts-per-page');
});
