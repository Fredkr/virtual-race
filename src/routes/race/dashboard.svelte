<script context="module">
    export async function preload(page, session) {

        const res = await this.fetch(`/api/race/get.json`, {credentials: 'include'});
        const races = await res.json();

        return { races };
    }



</script>

<script>
    import List from "./list.svelte";
    import Create from "./create.svelte";
    export let races;
    let onCreate = event => {
        races = [...races, event.detail.race];
    }
</script>

<main >
    <Create on:raceCreated={onCreate} />
    {#if races}
        <List races="{races}" />
    {/if}
</main>

<style>

</style>