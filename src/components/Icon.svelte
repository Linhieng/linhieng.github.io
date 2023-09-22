<script>
    export let src = ''
    export let alt = ''
</script>

<div class="icon-box">
    <img {src} {alt} />
</div>

<style>
    .icon-box {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    img {
        width: 30px;
    }
</style>
