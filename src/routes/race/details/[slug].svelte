<script context="module">
    export async function preload(page, session) {
        const {slug} = page.params;

        const res = await this.fetch(`/api/race/${slug}/get.json`);
        const race = await res.json();

        return {race};
    }
</script>

<script>
    import Map from '../map.svelte';
    export let race;

    let joinRace = async () => {
        const join = await fetch(`/api/race/${race._id}/join.json`, {method: 'put'});
        const test = await join.json();
        console.log(test);
        race = test;
    }
</script>


<div>
    <nav class="panel">
        <p class="panel-heading">
            {race.name}
            <button class="button is-primary" on:click={joinRace}>Join</button>
        </p>
        <div class="panel-block">
            {#if race.segment}
                <Map segment="{race.segment}"/>
            {/if}
        </div>
        <p class="panel-tabs">
            <span class="is-active">Details</span>
            <span>Participants</span>
            <span>Result</span>
        </p>

    </nav>
    {#each race.participants as participant}
        <div>{participant.name}</div>

    {/each}

</div>

<style lang="scss">
    .panel-heading {
        display: flex;
        align-items: center;

        button {
            margin-left: auto;
        }
    }
</style>