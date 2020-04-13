<script>
    import RaceCard from '../../components/RaceCard.svelte';

    export let races;
</script>

<div class="section">
    <div class="container">
        <h1 class="title">Races</h1>
        <div class="race-list tile is-ancestor test">
                {#each races as race}
                    <div class="tile is-parent is-4">
                        <div class="tile is-child">
                            <RaceCard race="{race}"/>
                        </div>
                    </div>

                {/each}

        </div>
    </div>


</div>

<style lang="scss">
    .test {
        flex-wrap: wrap;
    }
</style>