<script>
    import moment from 'moment';
    export let race;

    const formatDate = date => moment(date).format('YYYY-MM-DD');
    let url = `/race/details/${race._id}`;
</script>

<div class="card">
    <a class="card-href" href="{url}"> </a>
    <div class="card-image">
        <figure class="image is-4by3">
            <img src={race.segment.staticMap} alt="Placeholder image">
        </figure>
    </div>

    <div class="card-content">
        <p class="title">
            {race.name}
        </p>
        <div class="content">
            {race.description}
            <br>
            <span>{formatDate(race.dateSpan.from)} - {formatDate(race.dateSpan.to)}</span>
        </div>
    </div>
</div>


<style>
    .card {
        position: relative;
    }
    .title {
        font-size: 1rem;
    }

    .card-href {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 1;
    }
</style>