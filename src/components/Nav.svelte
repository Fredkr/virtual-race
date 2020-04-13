<script>
	import { stores } from "@sapper/app";
	import { onMount } from "svelte";

	const { session } = stores();
	export let user = $session.user;
</script>

<nav class="navbar" role="navigation">
	<div class="navbar-menu">
		<div class="navbar-start">
			<a class="navbar-item" href='/'>
				Home
			</a>
			{#if user}
				<div class="navbar-item has-dropdown is-hoverable">
					<span class="navbar-link">
						Races
					</span>

					<div class="navbar-dropdown">
						<a class="navbar-item" href='/race/dashboard'>
							Dashboard
						</a>
						<a class="navbar-item" href='/race/create'>
							Create
						</a>
					</div>
				</div>

				<div class="navbar-item has-dropdown is-hoverable">
					<span class="navbar-link">
						Profile
					</span>

					<div class="navbar-dropdown">
						<a class="navbar-item" href='/auth/strava'>
							Connect Strava
						</a>
						<a class="navbar-item" href='/auth/logout'>
							Disconnect Strava
						</a>
					</div>
				</div>
			{/if}
		</div>
	</div>
</nav>