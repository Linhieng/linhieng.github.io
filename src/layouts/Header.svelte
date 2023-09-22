<script>
    import Icon from '$components/Icon.svelte'
    import logo from '$lib/images/logo.svg'
    import github from '$lib/images/github.svg'
</script>

<header>
    <div class="corner">
        <div class="icon">
            <Icon src={logo} />
        </div>
    </div>

    <div class="header-center">
        <p>随心敲</p>
    </div>

    <div class="corner">
        <a href="https://github.com/linhieng" target="_blank">
            <Icon src={github} />
        </a>
    </div>
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
        box-shadow: 0 0 0 1px var(--border-gray, #ddd);
    }

    .corner {
        width: 3em;
        height: 3em;
    }

    .corner .icon {
        height: 100%;
    }

    @media screen and (min-width: 900px) {
        header {
            padding: 0 20px;
        }
    }
</style>
