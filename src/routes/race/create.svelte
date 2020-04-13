
<script>
    import moment from 'moment';
    import { onMount, createEventDispatcher } from 'svelte';
    import Map from './map.svelte';
    const dispatch = createEventDispatcher();

    const DATE_FORMAT = 'YYYY-MM-DD';
    let useSegment = true;

    let name = '';
    let description = '';
    let from = moment().format(DATE_FORMAT);
    let to = moment().add(7,'days').format(DATE_FORMAT);
    let segment = null;
    let loading = false;

    onMount(async () => {
        const calendars = bulmaCalendar.attach('[type="date"]', { type: 'date'});

        calendars.forEach(calendar => {
            calendar.on('select', ({ data }) => {
                const { startDate, endDate } = data;
                from = moment(startDate).format(DATE_FORMAT);
                to = moment(endDate).format(DATE_FORMAT);
            });
        });
    });

    let handleSegmentClick = (event) => {
        segment = event.detail.segment;
    };

    let handleSubmit = async (event) => {
        loading = true;

        const body = JSON.stringify({
            name,
            dateSpan: {
                from: moment(from).toDate(),
                to: moment(to).toDate()
            },
            description,
            segment
        });

        const res = await fetch("/api/race/create.json", {
            method: 'put',
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const race = await res.json();
        loading = false;
        dispatch('raceCreated', {
            race
        });
    }

</script>

<div class="section">
    <h1 class="title">Create a new event</h1>

    <form  on:submit|preventDefault="{handleSubmit}">
        <div class="field">
            <label class="label">Name </label>
            <input class="input" bind:value={name} placeholder="event name" required={true}>

        </div>
        <div class="field">
            <label class="label">Race dates</label>
            <input
                    class="input"
                    data-is-range="{true}"
                    data-label-from="{from}"
                    data-start-date="{from}"
                    data-end-date="{to}"
                    data-label-to="{to}"
                    data-show-buttons="{false}"
                    data-date-format="{DATE_FORMAT}"
                    type="date">

        </div>
        <div class="field">
            <label class="label">Description </label>
            <textarea class="textarea" bind:value={description} placeholder="the basics."></textarea>
        </div>
        <div class="field">
            <label class="label">Course</label>
            <div class="segmentToggle">
                <input id="useSegment" type="checkbox" name="useSegment" class="switch is-rounded" bind:checked={useSegment} >
                <label for="useSegment">Use Strava segment course</label>
            </div>


            {#if useSegment}
                <Map on:segmentClick={handleSegmentClick} segmentSearch="{true}"/>
                {#if segment}
                    <div class="segmentDetails">
                        <span>Name: {segment.name}</span>
                        <span>Distance: {segment.distance/1000} km</span>
                    </div>

                {/if}

            {:else}
                <input class="input" placeholder="distance">
            {/if}
        </div>
        <button class="{`button is-success is-medium is-fullwidth ${loading ? 'is-loading' : ''}`}"  type="submit" >Create </button>
    </form>
</div>

<style lang="scss" >
    .segmentToggle {
        padding-bottom: .5rem;
    }

    .segmentDetails {
        span {
            padding-right: 1rem;
        }
    }

</style>