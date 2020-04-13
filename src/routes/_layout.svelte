<script>
	import Nav from '../components/Nav.svelte';
</script>

<style lang="scss" global>
	@import "../style/global.scss";

	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<Nav />

<main>
	<slot></slot>
</main>