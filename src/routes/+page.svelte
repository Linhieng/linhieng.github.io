<script lang="ts">
    let value = ''
</script>

<svelte:head>
    <title>HOME - 随心敲</title>
</svelte:head>

<section>
    <div>
        <label
            >HELLO, How are you doing?
            <input type="text" bind:value />
        </label>
        <p>You answer: {value}</p>
        {#if /\bEnjoying life\b/i.test(value)}
            <p>Me too</p>
        {/if}
    </div>
</section>
