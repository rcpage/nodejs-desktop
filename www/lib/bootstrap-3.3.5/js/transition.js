


< !DOCTYPE html >
  <html lang="en" class=" is-copy-enabled">
    <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# object: http://ogp.me/ns/object# article: http://ogp.me/ns/article# profile: http://ogp.me/ns/profile#">
      <meta charset='utf-8'>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta http-equiv="Content-Language" content="en">
            <meta name="viewport" content="width=1020">


              <title>bootstrap/transition.js at master · twbs/bootstrap · GitHub</title>
              <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub">
                <link rel="fluid-icon" href="https://github.com/fluidicon.png" title="GitHub">
                  <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-114.png">
                    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114.png">
                      <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-144.png">
                        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144.png">
                          <meta property="fb:app_id" content="1401488693436528">

                            <meta content="@github" name="twitter:site" /><meta content="summary" name="twitter:card" /><meta content="twbs/bootstrap" name="twitter:title" /><meta content="bootstrap - The most popular HTML, CSS, and JavaScript framework for developing responsive, mobile first projects on the web." name="twitter:description" /><meta content="https://avatars1.githubusercontent.com/u/2918581?v=3&amp;s=400" name="twitter:image:src" />
                            <meta content="GitHub" property="og:site_name" /><meta content="object" property="og:type" /><meta content="https://avatars1.githubusercontent.com/u/2918581?v=3&amp;s=400" property="og:image" /><meta content="twbs/bootstrap" property="og:title" /><meta content="https://github.com/twbs/bootstrap" property="og:url" /><meta content="bootstrap - The most popular HTML, CSS, and JavaScript framework for developing responsive, mobile first projects on the web." property="og:description" />
                            <meta name="browser-stats-url" content="https://api.github.com/_private/browser/stats">
                              <meta name="browser-errors-url" content="https://api.github.com/_private/browser/errors">
                                <link rel="assets" href="https://assets-cdn.github.com/">

                                  <meta name="pjax-timeout" content="1000">


                                    <meta name="msapplication-TileImage" content="/windows-tile.png">
                                      <meta name="msapplication-TileColor" content="#ffffff">
                                        <meta name="selected-link" value="repo_source" data-pjax-transient>

                                          <meta name="google-analytics" content="UA-3769691-2">

                                            <meta content="collector.githubapp.com" name="octolytics-host" /><meta content="collector-cdn.github.com" name="octolytics-script-host" /><meta content="github" name="octolytics-app-id" /><meta content="A2E3C29B:0A7E:5ECBA85:55BDA8C3" name="octolytics-dimension-request_id" />

                                            <meta content="Rails, view, blob#show" data-pjax-transient="true" name="analytics-event" />
                                            <meta class="js-ga-set" name="dimension1" content="Logged Out">
                                              <meta class="js-ga-set" name="dimension4" content="Current repo nav">
                                                <meta name="is-dotcom" content="true">
                                                  <meta name="hostname" content="github.com">
                                                    <meta name="user-login" content="">

                                                      <link rel="icon" sizes="any" mask href="https://assets-cdn.github.com/pinned-octocat.svg">
                                                        <meta name="theme-color" content="#4078c0">
                                                          <link rel="icon" type="image/x-icon" href="https://assets-cdn.github.com/favicon.ico">

                                                            <!-- </textarea> --><!-- '"` --><meta content="authenticity_token" name="csrf-param" />
                                                          <meta content="AC9rGM4my4RQnCoKQ+x4895fIaOd9nWBgsTAVbVLlIIsN/JP5wsYkzBH81TVujeQghHMDMr/gfsywt12FQJkIg==" name="csrf-token" />


                                                          <link crossorigin="anonymous" href="https://assets-cdn.github.com/assets/github/index-c7126cd67871e693a9f863b7a0e99879ca39079b15a8784f8b543c03bf14ad72.css" media="all" rel="stylesheet" />
                                                          <link crossorigin="anonymous" href="https://assets-cdn.github.com/assets/github2/index-87247f16e6450ef54cb0eda3f8f1484e33a3f18c7a7d3df1f76f67cba36a8d6d.css" media="all" rel="stylesheet" />




                                                          <meta http-equiv="x-pjax-version" content="f8fdf7d6713452aadb5c847c2e94f51b">


                                                            <meta name="description" content="bootstrap - The most popular HTML, CSS, and JavaScript framework for developing responsive, mobile first projects on the web.">
                                                              <meta name="go-import" content="github.com/twbs/bootstrap git https://github.com/twbs/bootstrap.git">

                                                                <meta content="2918581" name="octolytics-dimension-user_id" /><meta content="twbs" name="octolytics-dimension-user_login" /><meta content="2126244" name="octolytics-dimension-repository_id" /><meta content="twbs/bootstrap" name="octolytics-dimension-repository_nwo" /><meta content="true" name="octolytics-dimension-repository_public" /><meta content="false" name="octolytics-dimension-repository_is_fork" /><meta content="2126244" name="octolytics-dimension-repository_network_root_id" /><meta content="twbs/bootstrap" name="octolytics-dimension-repository_network_root_nwo" />
                                                                <link href="https://github.com/twbs/bootstrap/commits/master.atom" rel="alternate" title="Recent Commits to bootstrap:master" type="application/atom+xml">

                                                                </head>


                                                                <body class="logged_out  env-production windows vis-public page-blob">
                                                                  <a href="#start-of-content" tabindex="1" class="accessibility-aid js-skip-to-content">Skip to content</a>
                                                                  <div class="wrapper">







                                                                    <div class="header header-logged-out" role="banner">
                                                                      <div class="container clearfix">

                                                                        <a class="header-logo-wordmark" href="https://github.com/" data-ga-click="(Logged out) Header, go to homepage, icon:logo-wordmark">
                                                                          <span class="mega-octicon octicon-logo-github"></span>
                                                                        </a>

                                                                        <div class="header-actions" role="navigation">
                                                                          <a class="btn btn-primary" href="/join" data-ga-click="(Logged out) Header, clicked Sign up, text:sign-up">Sign up</a>
                                                                          <a class="btn" href="/login?return_to=%2Ftwbs%2Fbootstrap%2Fblob%2Fmaster%2Fjs%2Ftransition.js" data-ga-click="(Logged out) Header, clicked Sign in, text:sign-in">Sign in</a>
                                                                        </div>

                                                                        <div class="site-search repo-scope js-site-search" role="search">
                                                                          <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/twbs/bootstrap/search" class="js-site-search-form" data-global-search-url="/search" data-repo-search-url="/twbs/bootstrap/search" method="get"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /></div>
                                                                          <label class="js-chromeless-input-container form-control">
                                                                            <div class="scope-badge">This repository</div>
                                                                            <input type="text"
                                                                              class="js-site-search-focus js-site-search-field is-clearable chromeless-input"
                                                                              data-hotkey="s"
                                                                              name="q"
                                                                              placeholder="Search"
                                                                              aria-label="Search this repository"
                                                                              data-global-scope-placeholder="Search GitHub"
                                                                              data-repo-scope-placeholder="Search"
                                                                              tabindex="1"
                                                                              autocapitalize="off">
                                                                          </label>
                                                                        </form>
                                                                      </div>

                                                                      <ul class="header-nav left" role="navigation">
                                                                        <li class="header-nav-item">
                                                                          <a class="header-nav-link" href="/explore" data-ga-click="(Logged out) Header, go to explore, text:explore">Explore</a>
                                                                        </li>
                                                                        <li class="header-nav-item">
                                                                          <a class="header-nav-link" href="/features" data-ga-click="(Logged out) Header, go to features, text:features">Features</a>
                                                                        </li>
                                                                        <li class="header-nav-item">
                                                                          <a class="header-nav-link" href="https://enterprise.github.com/" data-ga-click="(Logged out) Header, go to enterprise, text:enterprise">Enterprise</a>
                                                                        </li>
                                                                        <li class="header-nav-item">
                                                                          <a class="header-nav-link" href="/blog" data-ga-click="(Logged out) Header, go to blog, text:blog">Blog</a>
                                                                        </li>
                                                                      </ul>

                                                                    </div>
                                                                  </div>



                                                                  <div id="start-of-content" class="accessibility-aid"></div>
                                                                  <div class="site" itemscope itemtype="http://schema.org/WebPage">
                                                                    <div id="js-flash-container">

                                                                    </div>
                                                                    <div class="pagehead repohead instapaper_ignore readability-menu ">
                                                                      <div class="container">

                                                                        <div class="clearfix">

                                                                          <ul class="pagehead-actions">

                                                                            <li>
                                                                              <a href="/login?return_to=%2Ftwbs%2Fbootstrap"
                                                                                class="btn btn-sm btn-with-count tooltipped tooltipped-n"
                                                                                aria-label="You must be signed in to watch a repository" rel="nofollow">
                                                                                <span class="octicon octicon-eye"></span>
                                                                                Watch
                                                                              </a>
                                                                              <a class="social-count" href="/twbs/bootstrap/watchers">
                                                                                5,180
                                                                              </a>

                                                                            </li>

                                                                            <li>
                                                                              <a href="/login?return_to=%2Ftwbs%2Fbootstrap"
                                                                                class="btn btn-sm btn-with-count tooltipped tooltipped-n"
                                                                                aria-label="You must be signed in to star a repository" rel="nofollow">
                                                                                <span class="octicon octicon-star"></span>
                                                                                Star
                                                                              </a>

                                                                              <a class="social-count js-social-count" href="/twbs/bootstrap/stargazers">
                                                                                84,036
                                                                              </a>

                                                                            </li>

                                                                            <li>
                                                                              <a href="/login?return_to=%2Ftwbs%2Fbootstrap"
                                                                                class="btn btn-sm btn-with-count tooltipped tooltipped-n"
                                                                                aria-label="You must be signed in to fork a repository" rel="nofollow">
                                                                                <span class="octicon octicon-repo-forked"></span>
                                                                                Fork
                                                                              </a>
                                                                              <a href="/twbs/bootstrap/network" class="social-count">
                                                                                34,222
                                                                              </a>
                                                                            </li>
                                                                          </ul>

                                                                          <h1 itemscope itemtype="http://data-vocabulary.org/Breadcrumb" class="entry-title public ">
                                                                            <span class="mega-octicon octicon-repo"></span>
                                                                            <span class="author"><a href="/twbs" class="url fn" itemprop="url" rel="author"><span itemprop="title">twbs</span></a></span><!--
         --><span class="path-divider">/</span><!--
         --><strong><a href="/twbs/bootstrap" data-pjax="#js-repo-pjax-container">bootstrap</a></strong>

                                                                            <span class="page-context-loader">
                                                                              <img alt="" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
                                                                            </span>

                                                                          </h1>
                                                                        </div>

                                                                      </div>
                                                                    </div>

                                                                    <div class="container">
                                                                      <div class="repository-with-sidebar repo-container new-discussion-timeline ">
                                                                        <div class="repository-sidebar clearfix">


                                                                          <nav class="sunken-menu repo-nav js-repo-nav js-sidenav-container-pjax js-octicon-loaders"
                                                                            role="navigation"
                                                                            data-pjax="#js-repo-pjax-container"
                                                                            data-issue-count-url="/twbs/bootstrap/issues/counts">
                                                                            <ul class="sunken-menu-group">
                                                                              <li class="tooltipped tooltipped-w" aria-label="Code">
                                                                                <a href="/twbs/bootstrap" aria-label="Code" aria-selected="true" class="js-selected-navigation-item selected sunken-menu-item" data-hotkey="g c" data-selected-links="repo_source repo_downloads repo_commits repo_releases repo_tags repo_branches /twbs/bootstrap">
                                                                                  <span class="octicon octicon-code"></span> <span class="full-word">Code</span>
                                                                                  <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
                                                                                </a>    </li>

                                                                              <li class="tooltipped tooltipped-w" aria-label="Issues">
                                                                                <a href="/twbs/bootstrap/issues" aria-label="Issues" class="js-selected-navigation-item sunken-menu-item" data-hotkey="g i" data-selected-links="repo_issues repo_labels repo_milestones /twbs/bootstrap/issues">
                                                                                  <span class="octicon octicon-issue-opened"></span> <span class="full-word">Issues</span>
                                                                                  <span class="js-issue-replace-counter"></span>
                                                                                  <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
                                                                                </a>      </li>

                                                                              <li class="tooltipped tooltipped-w" aria-label="Pull requests">
                                                                                <a href="/twbs/bootstrap/pulls" aria-label="Pull requests" class="js-selected-navigation-item sunken-menu-item" data-hotkey="g p" data-selected-links="repo_pulls /twbs/bootstrap/pulls">
                                                                                  <span class="octicon octicon-git-pull-request"></span> <span class="full-word">Pull requests</span>
                                                                                  <span class="js-pull-replace-counter"></span>
                                                                                  <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
                                                                                </a>    </li>

                                                                            </ul>
                                                                            <div class="sunken-menu-separator"></div>
                                                                            <ul class="sunken-menu-group">

                                                                              <li class="tooltipped tooltipped-w" aria-label="Pulse">
                                                                                <a href="/twbs/bootstrap/pulse" aria-label="Pulse" class="js-selected-navigation-item sunken-menu-item" data-selected-links="pulse /twbs/bootstrap/pulse">
                                                                                  <span class="octicon octicon-pulse"></span> <span class="full-word">Pulse</span>
                                                                                  <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
                                                                                </a>    </li>

                                                                              <li class="tooltipped tooltipped-w" aria-label="Graphs">
                                                                                <a href="/twbs/bootstrap/graphs" aria-label="Graphs" class="js-selected-navigation-item sunken-menu-item" data-selected-links="repo_graphs repo_contributors /twbs/bootstrap/graphs">
                                                                                  <span class="octicon octicon-graph"></span> <span class="full-word">Graphs</span>
                                                                                  <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
                                                                                </a>    </li>
                                                                            </ul>


                                                                          </nav>

                                                                          <div class="only-with-full-nav">

                                                                            <div class="js-clone-url clone-url open"
                                                                              data-protocol-type="http">
                                                                              <h3><span class="text-emphasized">HTTPS</span> clone URL</h3>
                                                                              <div class="input-group js-zeroclipboard-container">
                                                                                <input type="text" class="input-mini input-monospace js-url-field js-zeroclipboard-target"
                                                                                  value="https://github.com/twbs/bootstrap.git" readonly="readonly" aria-label="HTTPS clone URL">
                                                                                <span class ="input-group-button">
                                                                                <button aria-label="Copy to clipboard" class ="js-zeroclipboard btn btn-sm zeroclipboard-button tooltipped tooltipped-s" data-copied-hint="Copied!" type ="button"><span class ="octicon octicon-clippy"></span></button>
                                                                                </span>
                                                                              </div>
                                                                            </div>


                                                                            <div class="js-clone-url clone-url "
                                                                              data-protocol-type="subversion">
                                                                              <h3><span class="text-emphasized">Subversion</span> checkout URL</h3>
                                                                              <div class="input-group js-zeroclipboard-container">
                                                                                <input type="text" class="input-mini input-monospace js-url-field js-zeroclipboard-target"
                                                                                  value="https://github.com/twbs/bootstrap" readonly="readonly" aria-label="Subversion checkout URL">
                                                                                <span class ="input-group-button">
                                                                                <button aria-label="Copy to clipboard" class ="js-zeroclipboard btn btn-sm zeroclipboard-button tooltipped tooltipped-s" data-copied-hint="Copied!" type ="button"><span class ="octicon octicon-clippy"></span></button>
                                                                                </span>
                                                                              </div>
                                                                            </div>



                                                                            <div class="clone-options">You can clone with
                                                                              <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/users/set_protocol?protocol_selector=http&amp;protocol_type=clone" class="inline-form js-clone-selector-form " data-form-nonce="6c9ab3b3cd42d5612d1f98e22bea203b4f31fa21" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="VyYH1tgU9+vnhXbD2AIprZEJ9Q1b8kT9hicCGt/4Px2G69QHx5I/UYaTEf7mbHVusc//N56/2BFN2gZBd8sLpQ==" /></div><button class="btn-link js-clone-selector" data-protocol="http" type="submit">HTTPS</button></form> or <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/users/set_protocol?protocol_selector=subversion&amp;protocol_type=clone" class="inline-form js-clone-selector-form " data-form-nonce="6c9ab3b3cd42d5612d1f98e22bea203b4f31fa21" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="Zkqnw7DZRYD+SZRva3WuRFVZuznsvA8x3Taf0y33idy4CWhEWvT7yAzlYIuw/LJjkwuMyDoxzPLJPbn+HWAiRA==" /></div><button class="btn-link js-clone-selector" data-protocol="subversion" type="submit">Subversion</button></form>.
                                                                          <a href="https://help.github.com/articles/which-remote-url-should-i-use" class="help tooltipped tooltipped-n" aria-label="Get help on which URL is right for you.">
                                                                            <span class="octicon octicon-question"></span>
                                                                          </a>
                                                                        </div>
                                                                        <a href="https://windows.github.com" class="btn btn-sm sidebar-button" title="Save twbs/bootstrap to your computer and use it in GitHub Desktop." aria-label="Save twbs/bootstrap to your computer and use it in GitHub Desktop.">
                                                                          <span class="octicon octicon-device-desktop"></span>
                                                                          Clone in Desktop
                                                                        </a>

                                                                        <a href="/twbs/bootstrap/archive/master.zip"
                                                                          class="btn btn-sm sidebar-button"
                                                                          aria-label="Download the contents of twbs/bootstrap as a zip file"
                                                                          title="Download the contents of twbs/bootstrap as a zip file"
                                                                          rel="nofollow">
                                                                          <span class="octicon octicon-cloud-download"></span>
                                                                          Download ZIP
                                                                        </a>
                                                                      </div>
                                                                    </div>
                                                                    <div id="js-repo-pjax-container" class="repository-content context-loader-container" data-pjax-container>



                                                                      <a href="/twbs/bootstrap/blob/027b7efd792f4fab065bc6e71d8d2573cd13cadb/js/transition.js" class="hidden js-permalink-shortcut" data-hotkey="y">Permalink</a>

                                                                      <!-- blob contrib key: blob_contributors:v21:046dcb9d1a19b2983e02334e0029ec2d -->

                                                                      <div class="file-navigation js-zeroclipboard-container">

                                                                        <div class="select-menu js-menu-container js-select-menu left">
                                                                          <span class="btn btn-sm select-menu-button js-menu-target css-truncate" data-hotkey="w"
                                                                            data-ref="master"
                                                                            title="master"
                                                                            role="button" aria-label="Switch branches or tags" tabindex="0" aria-haspopup="true">
                                                                            <i>Branch:</i>
                                                                            <span class="js-select-button css-truncate-target">master</span>
                                                                          </span>

                                                                          <div class="select-menu-modal-holder js-menu-content js-navigation-container" data-pjax aria-hidden="true">

                                                                            <div class="select-menu-modal">
                                                                              <div class="select-menu-header">
                                                                                <span class="select-menu-title">Switch branches/tags</span>
                                                                                <span class="octicon octicon-x js-menu-close" role="button" aria-label="Close"></span>
                                                                              </div>

                                                                              <div class="select-menu-filters">
                                                                                <div class="select-menu-text-filter">
                                                                                  <input type="text" aria-label="Filter branches/tags" id="context-commitish-filter-field" class="js-filterable-field js-navigation-enable" placeholder="Filter branches/tags">
                                                                                </div>
                                                                                <div class="select-menu-tabs">
                                                                                  <ul>
                                                                                    <li class="select-menu-tab">
                                                                                      <a href="#" data-tab-filter="branches" data-filter-placeholder="Filter branches/tags" class="js-select-menu-tab" role="tab">Branches</a>
                                                                                    </li>
                                                                                    <li class="select-menu-tab">
                                                                                      <a href="#" data-tab-filter="tags" data-filter-placeholder="Find a tag…" class="js-select-menu-tab" role="tab">Tags</a>
                                                                                    </li>
                                                                                  </ul>
                                                                                </div>
                                                                              </div>

                                                                              <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="branches" role="menu">

                                                                                <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


                                                                                  <a class="select-menu-item js-navigation-item js-navigation-open "
                                                                                    href="/twbs/bootstrap/blob/14226-rebased/js/transition.js"
                                                                                    data-name="14226-rebased"
                                                                                    data-skip-pjax="true"
                                                                                    rel="nofollow">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <span class="select-menu-item-text css-truncate-target" title="14226-rebased">
                                                                                      14226-rebased
                                                                                    </span>
                                                                                  </a>
                                                                                  <a class="select-menu-item js-navigation-item js-navigation-open "
                                                                                    href="/twbs/bootstrap/blob/bhamodi-update-dependencies/js/transition.js"
                                                                                    data-name="bhamodi-update-dependencies"
                                                                                    data-skip-pjax="true"
                                                                                    rel="nofollow">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <span class="select-menu-item-text css-truncate-target" title="bhamodi-update-dependencies">
                                                                                      bhamodi-update-dependencies
                                                                                    </span>
                                                                                  </a>
                                                                                  <a class="select-menu-item js-navigation-item js-navigation-open "
                                                                                    href="/twbs/bootstrap/blob/bundler/js/transition.js"
                                                                                    data-name="bundler"
                                                                                    data-skip-pjax="true"
                                                                                    rel="nofollow">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <span class="select-menu-item-text css-truncate-target" title="bundler">
                                                                                      bundler
                                                                                    </span>
                                                                                  </a>
                                                                                  <a class="select-menu-item js-navigation-item js-navigation-open "
                                                                                    href="/twbs/bootstrap/blob/derp/js/transition.js"
                                                                                    data-name="derp"
                                                                                    data-skip-pjax="true"
                                                                                    rel="nofollow">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <span class="select-menu-item-text css-truncate-target" title="derp">
                                                                                      derp
                                                                                    </span>
                                                                                  </a>
                                                                                  <a class="select-menu-item js-navigation-item js-navigation-open "
                                                                                    href="/twbs/bootstrap/blob/fix-15534/js/transition.js"
                                                                                    data-name="fix-15534"
                                                                                    data-skip-pjax="true"
                                                                                    rel="nofollow">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <span class="select-menu-item-text css-truncate-target" title="fix-15534">
                                                                                      fix-15534
                                                                                    </span>
                                                                                  </a>
                                                                                  <a class="select-menu-item js-navigation-item js-navigation-open "
                                                                                    href="/twbs/bootstrap/blob/fix-popover-setContent/js/transition.js"
                                                                                    data-name="fix-popover-setContent"
                                                                                    data-skip-pjax="true"
                                                                                    rel="nofollow">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <span class="select-menu-item-text css-truncate-target" title="fix-popover-setContent">
                                                                                      fix-popover-setContent
                                                                                    </span>
                                                                                  </a>
                                                                                  <a class="select-menu-item js-navigation-item js-navigation-open "
                                                                                    href="/twbs/bootstrap/blob/gh-pages/js/transition.js"
                                                                                    data-name="gh-pages"
                                                                                    data-skip-pjax="true"
                                                                                    rel="nofollow">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <span class="select-menu-item-text css-truncate-target" title="gh-pages">
                                                                                      gh-pages
                                                                                    </span>
                                                                                  </a>
                                                                                  <a class="select-menu-item js-navigation-item js-navigation-open selected"
                                                                                    href="/twbs/bootstrap/blob/master/js/transition.js"
                                                                                    data-name="master"
                                                                                    data-skip-pjax="true"
                                                                                    rel="nofollow">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <span class="select-menu-item-text css-truncate-target" title="master">
                                                                                      master
                                                                                    </span>
                                                                                  </a>
                                                                                  <a class="select-menu-item js-navigation-item js-navigation-open "
                                                                                    href="/twbs/bootstrap/blob/travis2/js/transition.js"
                                                                                    data-name="travis2"
                                                                                    data-skip-pjax="true"
                                                                                    rel="nofollow">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <span class="select-menu-item-text css-truncate-target" title="travis2">
                                                                                      travis2
                                                                                    </span>
                                                                                  </a>
                                                                                </div>

                                                                                <div class="select-menu-no-results">Nothing to show</div>
                                                                              </div>

                                                                              <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="tags">
                                                                                <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v3.3.5/js/transition.js"
                                                                                      data-name="v3.3.5"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v3.3.5">v3.3.5</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v3.3.4/js/transition.js"
                                                                                      data-name="v3.3.4"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v3.3.4">v3.3.4</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v3.3.2/js/transition.js"
                                                                                      data-name="v3.3.2"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v3.3.2">v3.3.2</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v3.3.1/js/transition.js"
                                                                                      data-name="v3.3.1"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v3.3.1">v3.3.1</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v3.3.0/js/transition.js"
                                                                                      data-name="v3.3.0"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v3.3.0">v3.3.0</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v3.2.0/js/transition.js"
                                                                                      data-name="v3.2.0"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v3.2.0">v3.2.0</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v3.1.1/js/transition.js"
                                                                                      data-name="v3.1.1"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v3.1.1">v3.1.1</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v3.1.0/js/transition.js"
                                                                                      data-name="v3.1.0"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v3.1.0">v3.1.0</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v3.0.3/js/transition.js"
                                                                                      data-name="v3.0.3"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v3.0.3">v3.0.3</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v3.0.2/js/transition.js"
                                                                                      data-name="v3.0.2"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v3.0.2">v3.0.2</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v3.0.1/js/transition.js"
                                                                                      data-name="v3.0.1"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v3.0.1">v3.0.1</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v3.0.0-rc.2/js/transition.js"
                                                                                      data-name="v3.0.0-rc.2"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v3.0.0-rc.2">v3.0.0-rc.2</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v3.0.0-rc1/js/transition.js"
                                                                                      data-name="v3.0.0-rc1"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v3.0.0-rc1">v3.0.0-rc1</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v3.0.0/js/transition.js"
                                                                                      data-name="v3.0.0"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v3.0.0">v3.0.0</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v2.3.2/js/transition.js"
                                                                                      data-name="v2.3.2"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v2.3.2">v2.3.2</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v2.3.1/js/transition.js"
                                                                                      data-name="v2.3.1"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v2.3.1">v2.3.1</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v2.3.0/js/transition.js"
                                                                                      data-name="v2.3.0"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v2.3.0">v2.3.0</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v2.2.2/js/transition.js"
                                                                                      data-name="v2.2.2"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v2.2.2">v2.2.2</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v2.2.1/js/transition.js"
                                                                                      data-name="v2.2.1"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v2.2.1">v2.2.1</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v2.2.0/js/transition.js"
                                                                                      data-name="v2.2.0"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v2.2.0">v2.2.0</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v2.1.1/js/transition.js"
                                                                                      data-name="v2.1.1"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v2.1.1">v2.1.1</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v2.1.0/js/transition.js"
                                                                                      data-name="v2.1.0"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v2.1.0">v2.1.0</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v2.0.4/js/transition.js"
                                                                                      data-name="v2.0.4"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v2.0.4">v2.0.4</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v2.0.3/js/transition.js"
                                                                                      data-name="v2.0.3"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v2.0.3">v2.0.3</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v2.0.2/js/transition.js"
                                                                                      data-name="v2.0.2"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v2.0.2">v2.0.2</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v2.0.1/js/transition.js"
                                                                                      data-name="v2.0.1"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v2.0.1">v2.0.1</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v2.0.0/js/transition.js"
                                                                                      data-name="v2.0.0"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v2.0.0">v2.0.0</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v1.4.0/js/transition.js"
                                                                                      data-name="v1.4.0"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v1.4.0">v1.4.0</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v1.3.0/js/transition.js"
                                                                                      data-name="v1.3.0"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v1.3.0">v1.3.0</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v1.2.0/js/transition.js"
                                                                                      data-name="v1.2.0"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v1.2.0">v1.2.0</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v1.1.1/js/transition.js"
                                                                                      data-name="v1.1.1"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v1.1.1">v1.1.1</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v1.1.0/js/transition.js"
                                                                                      data-name="v1.1.0"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v1.1.0">v1.1.0</a>
                                                                                  </div>
                                                                                  <div class="select-menu-item js-navigation-item ">
                                                                                    <span class="select-menu-item-icon octicon octicon-check"></span>
                                                                                    <a href="/twbs/bootstrap/tree/v1.0.0/js/transition.js"
                                                                                      data-name="v1.0.0"
                                                                                      data-skip-pjax="true"
                                                                                      rel="nofollow"
                                                                                      class="js-navigation-open select-menu-item-text css-truncate-target"
                                                                                      title="v1.0.0">v1.0.0</a>
                                                                                  </div>
                                                                                </div>

                                                                                <div class="select-menu-no-results">Nothing to show</div>
                                                                              </div>

                                                                            </div>
                                                                          </div>
                                                                        </div>

                                                                        <div class="btn-group right">
                                                                          <a href="/twbs/bootstrap/find/master"
                                                                            class="js-show-file-finder btn btn-sm empty-icon tooltipped tooltipped-nw"
                                                                            data-pjax
                                                                            data-hotkey="t"
                                                                            aria-label="Quickly jump between files">
                                                                            <span class="octicon octicon-list-unordered"></span>
                                                                          </a>
                                                                          <button aria-label="Copy file path to clipboard" class="js-zeroclipboard btn btn-sm zeroclipboard-button tooltipped tooltipped-s" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>
                                                                        </div>

                                                                        <div class="breadcrumb js-zeroclipboard-target">
                                                                          <span class="repo-root js-repo-root"><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/twbs/bootstrap" class="" data-branch="master" data-pjax="true" itemscope="url"><span itemprop="title">bootstrap</span></a></span></span><span class="separator">/</span><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/twbs/bootstrap/tree/master/js" class="" data-branch="master" data-pjax="true" itemscope="url"><span itemprop="title">js</span></a></span><span class="separator">/</span><strong class="final-path">transition.js</strong>
                                                                        </div>
                                                                      </div>


                                                                      <div class="commit file-history-tease">
                                                                        <div class="file-history-tease-header">
                                                                          <img alt="@mdo" class="avatar" height="24" src="https://avatars2.githubusercontent.com/u/98681?v=3&amp;s=48" width="24" />
                                                                          <span class="author"><a href="/mdo" rel="contributor">mdo</a></span>
                                                                          <time datetime="2015-06-16T16:10:22Z" is="relative-time">Jun 16, 2015</time>
                                                                          <div class="commit-title">
                                                                            <a href="/twbs/bootstrap/commit/83bfff7f0765503b990b96c303eef67009e48d77" class="message" data-pjax="true" title="bump version">bump version</a>
                                                                          </div>
                                                                        </div>

                                                                        <div class="participation">
                                                                          <p class="quickstat">
                                                                            <a href="#blob_contributors_box" rel="facebox">
                                                                              <strong>10</strong>
                                                                              contributors
                                                                            </a>
                                                                          </p>
                                                                          <a class="avatar-link tooltipped tooltipped-s" aria-label="mdo" href="/twbs/bootstrap/commits/master/js/transition.js?author=mdo"><img alt="@mdo" class="avatar" height="20" src="https://avatars0.githubusercontent.com/u/98681?v=3&amp;s=40" width="20" /> </a>
                                                                          <a class="avatar-link tooltipped tooltipped-s" aria-label="fat" href="/twbs/bootstrap/commits/master/js/transition.js?author=fat"><img alt="@fat" class="avatar" height="20" src="https://avatars1.githubusercontent.com/u/169705?v=3&amp;s=40" width="20" /> </a>
                                                                          <a class="avatar-link tooltipped tooltipped-s" aria-label="cvrebert" href="/twbs/bootstrap/commits/master/js/transition.js?author=cvrebert"><img alt="@cvrebert" class="avatar" height="20" src="https://avatars0.githubusercontent.com/u/419884?v=3&amp;s=40" width="20" /> </a>
                                                                          <a class="avatar-link tooltipped tooltipped-s" aria-label="ZDroid" href="/twbs/bootstrap/commits/master/js/transition.js?author=ZDroid"><img alt="@ZDroid" class="avatar" height="20" src="https://avatars2.githubusercontent.com/u/2725611?v=3&amp;s=40" width="20" /> </a>
                                                                          <a class="avatar-link tooltipped tooltipped-s" aria-label="XhmikosR" href="/twbs/bootstrap/commits/master/js/transition.js?author=XhmikosR"><img alt="@XhmikosR" class="avatar" height="20" src="https://avatars1.githubusercontent.com/u/349621?v=3&amp;s=40" width="20" /> </a>
                                                                          <a class="avatar-link tooltipped tooltipped-s" aria-label="liuyl" href="/twbs/bootstrap/commits/master/js/transition.js?author=liuyl"><img alt="@liuyl" class="avatar" height="20" src="https://avatars0.githubusercontent.com/u/1261809?v=3&amp;s=40" width="20" /> </a>
                                                                          <a class="avatar-link tooltipped tooltipped-s" aria-label="hnrch02" href="/twbs/bootstrap/commits/master/js/transition.js?author=hnrch02"><img alt="@hnrch02" class="avatar" height="20" src="https://avatars3.githubusercontent.com/u/1068978?v=3&amp;s=40" width="20" /> </a>
                                                                          <a class="avatar-link tooltipped tooltipped-s" aria-label="daguej" href="/twbs/bootstrap/commits/master/js/transition.js?author=daguej"><img alt="@daguej" class="avatar" height="20" src="https://avatars2.githubusercontent.com/u/354349?v=3&amp;s=40" width="20" /> </a>
                                                                          <a class="avatar-link tooltipped tooltipped-s" aria-label="ktzhu" href="/twbs/bootstrap/commits/master/js/transition.js?author=ktzhu"><img alt="@ktzhu" class="avatar" height="20" src="https://avatars2.githubusercontent.com/u/530279?v=3&amp;s=40" width="20" /> </a>
                                                                          <a class="avatar-link tooltipped tooltipped-s" aria-label="juthilo" href="/twbs/bootstrap/commits/master/js/transition.js?author=juthilo"><img alt="@juthilo" class="avatar" height="20" src="https://avatars1.githubusercontent.com/u/3535675?v=3&amp;s=40" width="20" /> </a>


                                                                        </div>
                                                                        <div id="blob_contributors_box" style="display:none">
                                                                          <h2 class="facebox-header">Users who have contributed to this file</h2>
                                                                          <ul class="facebox-user-list">
                                                                            <li class="facebox-user-list-item">
                                                                              <img alt="@mdo" height="24" src="https://avatars2.githubusercontent.com/u/98681?v=3&amp;s=48" width="24" />
                                                                              <a href="/mdo">mdo</a>
                                                                            </li>
                                                                            <li class="facebox-user-list-item">
                                                                              <img alt="@fat" height="24" src="https://avatars3.githubusercontent.com/u/169705?v=3&amp;s=48" width="24" />
                                                                              <a href="/fat">fat</a>
                                                                            </li>
                                                                            <li class="facebox-user-list-item">
                                                                              <img alt="@cvrebert" height="24" src="https://avatars2.githubusercontent.com/u/419884?v=3&amp;s=48" width="24" />
                                                                              <a href="/cvrebert">cvrebert</a>
                                                                            </li>
                                                                            <li class="facebox-user-list-item">
                                                                              <img alt="@ZDroid" height="24" src="https://avatars0.githubusercontent.com/u/2725611?v=3&amp;s=48" width="24" />
                                                                              <a href="/ZDroid">ZDroid</a>
                                                                            </li>
                                                                            <li class="facebox-user-list-item">
                                                                              <img alt="@XhmikosR" height="24" src="https://avatars3.githubusercontent.com/u/349621?v=3&amp;s=48" width="24" />
                                                                              <a href="/XhmikosR">XhmikosR</a>
                                                                            </li>
                                                                            <li class="facebox-user-list-item">
                                                                              <img alt="@liuyl" height="24" src="https://avatars2.githubusercontent.com/u/1261809?v=3&amp;s=48" width="24" />
                                                                              <a href="/liuyl">liuyl</a>
                                                                            </li>
                                                                            <li class="facebox-user-list-item">
                                                                              <img alt="@hnrch02" height="24" src="https://avatars1.githubusercontent.com/u/1068978?v=3&amp;s=48" width="24" />
                                                                              <a href="/hnrch02">hnrch02</a>
                                                                            </li>
                                                                            <li class="facebox-user-list-item">
                                                                              <img alt="@daguej" height="24" src="https://avatars0.githubusercontent.com/u/354349?v=3&amp;s=48" width="24" />
                                                                              <a href="/daguej">daguej</a>
                                                                            </li>
                                                                            <li class="facebox-user-list-item">
                                                                              <img alt="@ktzhu" height="24" src="https://avatars0.githubusercontent.com/u/530279?v=3&amp;s=48" width="24" />
                                                                              <a href="/ktzhu">ktzhu</a>
                                                                            </li>
                                                                            <li class="facebox-user-list-item">
                                                                              <img alt="@juthilo" height="24" src="https://avatars3.githubusercontent.com/u/3535675?v=3&amp;s=48" width="24" />
                                                                              <a href="/juthilo">juthilo</a>
                                                                            </li>
                                                                          </ul>
                                                                        </div>
                                                                      </div>

                                                                      <div class="file">
                                                                        <div class="file-header">
                                                                          <div class="file-actions">

                                                                            <div class="btn-group">
                                                                              <a href="/twbs/bootstrap/raw/master/js/transition.js" class="btn btn-sm " id="raw-url">Raw</a>
                                                                              <a href="/twbs/bootstrap/blame/master/js/transition.js" class="btn btn-sm js-update-url-with-hash">Blame</a>
                                                                              <a href="/twbs/bootstrap/commits/master/js/transition.js" class="btn btn-sm " rel="nofollow">History</a>
                                                                            </div>

                                                                            <a class="octicon-btn tooltipped tooltipped-nw"
                                                                              href="https://windows.github.com"
                                                                              aria-label="Open this file in GitHub for Windows"
                                                                              data-ga-click="Repository, open with desktop, type:windows">
                                                                              <span class="octicon octicon-device-desktop"></span>
                                                                            </a>

                                                                            <button type="button" class="octicon-btn disabled tooltipped tooltipped-n" aria-label="You must be signed in to make or propose changes">
                                                                              <span class="octicon octicon-pencil"></span>
                                                                            </button>

                                                                            <button type="button" class="octicon-btn octicon-btn-danger disabled tooltipped tooltipped-n" aria-label="You must be signed in to make or propose changes">
                                                                              <span class="octicon octicon-trashcan"></span>
                                                                            </button>
                                                                          </div>

                                                                          <div class="file-info">
                                                                            60 lines (47 sloc)
                                                                            <span class="file-info-divider"></span>
                                                                            1.831 kB
                                                                          </div>
                                                                        </div>


                                                                        <div class="blob-wrapper data type-javascript">
                                                                          <table class="highlight tab-size js-file-line-container" data-tab-size="2">
                                                                            <tr>
                                                                              <td id="L1" class="blob-num js-line-number" data-line-number="1"></td>
                                                                              <td id="LC1" class="blob-code blob-code-inner js-file-line"><span class="pl-c">/* ========================================================================</span></td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L2" class="blob-num js-line-number" data-line-number="2"></td>
                                                                              <td id="LC2" class="blob-code blob-code-inner js-file-line"><span class="pl-c"> * Bootstrap: transition.js v3.3.5</span></td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L3" class="blob-num js-line-number" data-line-number="3"></td>
                                                                              <td id="LC3" class="blob-code blob-code-inner js-file-line"><span class="pl-c"> * http://getbootstrap.com/javascript/#transitions</span></td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L4" class="blob-num js-line-number" data-line-number="4"></td>
                                                                              <td id="LC4" class="blob-code blob-code-inner js-file-line"><span class="pl-c"> * ========================================================================</span></td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L5" class="blob-num js-line-number" data-line-number="5"></td>
                                                                              <td id="LC5" class="blob-code blob-code-inner js-file-line"><span class="pl-c"> * Copyright 2011-2015 Twitter, Inc.</span></td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L6" class="blob-num js-line-number" data-line-number="6"></td>
                                                                              <td id="LC6" class="blob-code blob-code-inner js-file-line"><span class="pl-c"> * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)</span></td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L7" class="blob-num js-line-number" data-line-number="7"></td>
                                                                              <td id="LC7" class="blob-code blob-code-inner js-file-line"><span class="pl-c"> * ======================================================================== */</span></td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L8" class="blob-num js-line-number" data-line-number="8"></td>
                                                                              <td id="LC8" class="blob-code blob-code-inner js-file-line">
                                                                              </td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L9" class="blob-num js-line-number" data-line-number="9"></td>
                                                                              <td id="LC9" class="blob-code blob-code-inner js-file-line">
                                                                              </td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L10" class="blob-num js-line-number" data-line-number="10"></td>
                                                                              <td id="LC10" class="blob-code blob-code-inner js-file-line"><span class="pl-k">+</span><span class="pl-k">function</span> (<span class="pl-smi">$</span>) {</td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L11" class="blob-num js-line-number" data-line-number="11"></td>
                                                                              <td id="LC11" class="blob-code blob-code-inner js-file-line">  <span class="pl-s"><span class="pl-pds">&#39;</span>use strict<span class="pl-pds">&#39;</span></span>;</td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L12" class="blob-num js-line-number" data-line-number="12"></td>
                                                                              <td id="LC12" class="blob-code blob-code-inner js-file-line">
                                                                              </td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L13" class="blob-num js-line-number" data-line-number="13"></td>
                                                                              <td id="LC13" class="blob-code blob-code-inner js-file-line">  <span class="pl-c">// CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)</span></td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L14" class="blob-num js-line-number" data-line-number="14"></td>
                                                                              <td id="LC14" class="blob-code blob-code-inner js-file-line">  <span class="pl-c">// ============================================================</span></td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L15" class="blob-num js-line-number" data-line-number="15"></td>
                                                                              <td id="LC15" class="blob-code blob-code-inner js-file-line">
                                                                              </td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L16" class="blob-num js-line-number" data-line-number="16"></td>
                                                                              <td id="LC16" class="blob-code blob-code-inner js-file-line">  <span class="pl-k">function</span> <span class="pl-en">transitionEnd</span>() {</td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L17" class="blob-num js-line-number" data-line-number="17"></td>
                                                                              <td id="LC17" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">var</span> el <span class="pl-k">=</span> <span class="pl-c1">document</span>.<span class="pl-c1">createElement</span>(<span class="pl-s"><span class="pl-pds">&#39;</span>bootstrap<span class="pl-pds">&#39;</span></span>)</td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L18" class="blob-num js-line-number" data-line-number="18"></td>
                                                                              <td id="LC18" class="blob-code blob-code-inner js-file-line">
                                                                              </td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L19" class="blob-num js-line-number" data-line-number="19"></td>
                                                                              <td id="LC19" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">var</span> transEndEventNames <span class="pl-k">=</span> {</td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L20" class="blob-num js-line-number" data-line-number="20"></td>
                                                                              <td id="LC20" class="blob-code blob-code-inner js-file-line">      WebkitTransition <span class="pl-k">:</span> <span class="pl-s"><span class="pl-pds">&#39;</span>webkitTransitionEnd<span class="pl-pds">&#39;</span></span>,</td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L21" class="blob-num js-line-number" data-line-number="21"></td>
                                                                              <td id="LC21" class="blob-code blob-code-inner js-file-line">      MozTransition    <span class="pl-k">:</span> <span class="pl-s"><span class="pl-pds">&#39;</span>transitionend<span class="pl-pds">&#39;</span></span>,</td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L22" class="blob-num js-line-number" data-line-number="22"></td>
                                                                              <td id="LC22" class="blob-code blob-code-inner js-file-line">      OTransition      <span class="pl-k">:</span> <span class="pl-s"><span class="pl-pds">&#39;</span>oTransitionEnd otransitionend<span class="pl-pds">&#39;</span></span>,</td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L23" class="blob-num js-line-number" data-line-number="23"></td>
                                                                              <td id="LC23" class="blob-code blob-code-inner js-file-line">      transition       <span class="pl-k">:</span> <span class="pl-s"><span class="pl-pds">&#39;</span>transitionend<span class="pl-pds">&#39;</span></span></td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L24" class="blob-num js-line-number" data-line-number="24"></td>
                                                                              <td id="LC24" class="blob-code blob-code-inner js-file-line">    }</td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L25" class="blob-num js-line-number" data-line-number="25"></td>
                                                                              <td id="LC25" class="blob-code blob-code-inner js-file-line">
                                                                              </td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L26" class="blob-num js-line-number" data-line-number="26"></td>
                                                                              <td id="LC26" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">for</span> (<span class="pl-k">var</span> name <span class="pl-k">in</span> transEndEventNames) {</td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L27" class="blob-num js-line-number" data-line-number="27"></td>
                                                                              <td id="LC27" class="blob-code blob-code-inner js-file-line">      <span class="pl-k">if</span> (el.<span class="pl-c1">style</span>[name] <span class="pl-k">!==</span> <span class="pl-c1">undefined</span>) {</td>
                                                                            </tr>
                                                                            <tr>
                                                                              <td id="L28" class="blob-num js-line-number" data-line-number="28"></td>
                                                                              <td id="LC28" class="blob-code blob-code-inner js-file-line">        <span class="pl-k">return</span> {end < span class="pl-k">:</span> transEndEventNames[name] }</td>
                                                                          </tr>
                                                                          <tr>
                                                                            <td id="L29" class="blob-num js-line-number" data-line-number="29"></td>
                                                                            <td id="LC29" class="blob-code blob-code-inner js-file-line">      }</td>
                                                                          </tr>
                                                                          <tr>
                                                                            <td id="L30" class="blob-num js-line-number" data-line-number="30"></td>
                                                                            <td id="LC30" class="blob-code blob-code-inner js-file-line">    }</td>
                                                                          </tr>
                                                                          <tr>
                                                                            <td id="L31" class="blob-num js-line-number" data-line-number="31"></td>
                                                                            <td id="LC31" class="blob-code blob-code-inner js-file-line">
                                                                            </td>
                                                                          </tr>
                                                                          <tr>
                                                                            <td id="L32" class="blob-num js-line-number" data-line-number="32"></td>
                                                                            <td id="LC32" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">return</span> <span class="pl-c1">false</span> <span class="pl-c">// explicit for ie8 (  ._.)</span></td>
                                                                          </tr>
                                                                          <tr>
                                                                            <td id="L33" class="blob-num js-line-number" data-line-number="33"></td>
                                                                            <td id="LC33" class="blob-code blob-code-inner js-file-line">  }</td>
                                                                          </tr>
                                                                          <tr>
                                                                            <td id="L34" class="blob-num js-line-number" data-line-number="34"></td>
                                                                            <td id="LC34" class="blob-code blob-code-inner js-file-line">
                                                                            </td>
                                                                          </tr>
                                                                          <tr>
                                                                            <td id="L35" class="blob-num js-line-number" data-line-number="35"></td>
                                                                            <td id="LC35" class="blob-code blob-code-inner js-file-line">  <span class="pl-c">// http://blog.alexmaccaw.com/css-transitions</span></td>
                                                                          </tr>
                                                                          <tr>
                                                                            <td id="L36" class="blob-num js-line-number" data-line-number="36"></td>
                                                                            <td id="LC36" class="blob-code blob-code-inner js-file-line">  <span class="pl-c1">$.fn</span>.<span class="pl-en">emulateTransitionEnd</span> <span class="pl-k">=</span> <span class="pl-k">function</span> (<span class="pl-smi">duration</span>) {</td>
                                                                          </tr>
                                                                          <tr>
                                                                            <td id="L37" class="blob-num js-line-number" data-line-number="37"></td>
                                                                            <td id="LC37" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">var</span> called <span class="pl-k">=</span> <span class="pl-c1">false</span></td>
                                                                          </tr>
                                                                          <tr>
                                                                            <td id="L38" class="blob-num js-line-number" data-line-number="38"></td>
                                                                            <td id="LC38" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">var</span> $el <span class="pl-k">=</span> <span class="pl-v">this</span></td>
                                                                          </tr>
                                                                          <tr>
                                                                            <td id="L39" class="blob-num js-line-number" data-line-number="39"></td>
                                                                            <td id="LC39" class="blob-code blob-code-inner js-file-line">    $(<span class="pl-v">this</span>).one(<span class="pl-s"><span class="pl-pds">&#39;</span>bsTransitionEnd<span class="pl-pds">&#39;</span></span>, <span class="pl-k">function</span> () {called < span class="pl-k">=</span> <span class="pl-c1">true</span> })</td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L40" class="blob-num js-line-number" data-line-number="40"></td>
                                                                          <td id="LC40" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">var</span> <span class="pl-en">callback</span> <span class="pl-k">=</span> <span class="pl-k">function</span> () {<span class="pl-k">if</span> (<span class="pl-k">!</span>called) $($el).trigger($.support.transition.end) }</td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L41" class="blob-num js-line-number" data-line-number="41"></td>
                                                                          <td id="LC41" class="blob-code blob-code-inner js-file-line">    <span class="pl-c1">setTimeout</span>(callback, duration)</td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L42" class="blob-num js-line-number" data-line-number="42"></td>
                                                                          <td id="LC42" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">return</span> <span class="pl-v">this</span></td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L43" class="blob-num js-line-number" data-line-number="43"></td>
                                                                          <td id="LC43" class="blob-code blob-code-inner js-file-line">  }</td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L44" class="blob-num js-line-number" data-line-number="44"></td>
                                                                          <td id="LC44" class="blob-code blob-code-inner js-file-line">
                                                                          </td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L45" class="blob-num js-line-number" data-line-number="45"></td>
                                                                          <td id="LC45" class="blob-code blob-code-inner js-file-line">  $(<span class="pl-k">function</span> () {</td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L46" class="blob-num js-line-number" data-line-number="46"></td>
                                                                          <td id="LC46" class="blob-code blob-code-inner js-file-line">    $.support.transition <span class="pl-k">=</span> transitionEnd()</td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L47" class="blob-num js-line-number" data-line-number="47"></td>
                                                                          <td id="LC47" class="blob-code blob-code-inner js-file-line">
                                                                          </td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L48" class="blob-num js-line-number" data-line-number="48"></td>
                                                                          <td id="LC48" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">if</span> (<span class="pl-k">!</span>$.support.transition) <span class="pl-k">return</span></td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L49" class="blob-num js-line-number" data-line-number="49"></td>
                                                                          <td id="LC49" class="blob-code blob-code-inner js-file-line">
                                                                          </td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L50" class="blob-num js-line-number" data-line-number="50"></td>
                                                                          <td id="LC50" class="blob-code blob-code-inner js-file-line">    $.<span class="pl-c1">event</span>.special.bsTransitionEnd <span class="pl-k">=</span> {</td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L51" class="blob-num js-line-number" data-line-number="51"></td>
                                                                          <td id="LC51" class="blob-code blob-code-inner js-file-line">      bindType<span class="pl-k">:</span> $.support.transition.end,</td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L52" class="blob-num js-line-number" data-line-number="52"></td>
                                                                          <td id="LC52" class="blob-code blob-code-inner js-file-line">      delegateType<span class="pl-k">:</span> $.support.transition.end,</td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L53" class="blob-num js-line-number" data-line-number="53"></td>
                                                                          <td id="LC53" class="blob-code blob-code-inner js-file-line">      <span class="pl-en">handle</span><span class="pl-k">:</span> <span class="pl-k">function</span> (<span class="pl-smi">e</span>) {</td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L54" class="blob-num js-line-number" data-line-number="54"></td>
                                                                          <td id="LC54" class="blob-code blob-code-inner js-file-line">        <span class="pl-k">if</span> ($(e.<span class="pl-c1">target</span>).is(<span class="pl-v">this</span>)) <span class="pl-k">return</span> e.handleObj.handler.<span class="pl-c1">apply</span>(<span class="pl-v">this</span>, arguments)</td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L55" class="blob-num js-line-number" data-line-number="55"></td>
                                                                          <td id="LC55" class="blob-code blob-code-inner js-file-line">      }</td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L56" class="blob-num js-line-number" data-line-number="56"></td>
                                                                          <td id="LC56" class="blob-code blob-code-inner js-file-line">    }</td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L57" class="blob-num js-line-number" data-line-number="57"></td>
                                                                          <td id="LC57" class="blob-code blob-code-inner js-file-line">  })</td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L58" class="blob-num js-line-number" data-line-number="58"></td>
                                                                          <td id="LC58" class="blob-code blob-code-inner js-file-line">
                                                                          </td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td id="L59" class="blob-num js-line-number" data-line-number="59"></td>
                                                                          <td id="LC59" class="blob-code blob-code-inner js-file-line">}(jQuery);</td>
                                                                        </tr>
                                                                      </table>

                                                                    </div>

                                                                  </div>

                                                                  <a href="#jump-to-line" rel="facebox[.linejump]" data-hotkey="l" style="display:none">Jump to Line</a>
                                                                  <div id="jump-to-line" style="display:none">
                                                                    <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="" class="js-jump-to-line-form" method="get"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /></div>
                                                                    <input class="linejump-input js-jump-to-line-field" type="text" placeholder="Jump to line&hellip;" aria-label="Jump to line" autofocus>
                                                                    <button type ="submit" class ="btn">Go</button>
                                                                  </form></div>

                                                              </div>
                                                            </div>
                                                            <div class="modal-backdrop"></div>
                                                          </div>
                                                        </div>


                                                      </div><!-- /.wrapper -->

                                                      <div class="container">
                                                        <div class="site-footer" role="contentinfo">
                                                          <ul class="site-footer-links right">
                                                            <li><a href="https://status.github.com/" data-ga-click="Footer, go to status, text:status">Status</a></li>
                                                            <li><a href="https://developer.github.com" data-ga-click="Footer, go to api, text:api">API</a></li>
                                                            <li><a href="https://training.github.com" data-ga-click="Footer, go to training, text:training">Training</a></li>
                                                            <li><a href="https://shop.github.com" data-ga-click="Footer, go to shop, text:shop">Shop</a></li>
                                                            <li><a href="https://github.com/blog" data-ga-click="Footer, go to blog, text:blog">Blog</a></li>
                                                            <li><a href="https://github.com/about" data-ga-click="Footer, go to about, text:about">About</a></li>
                                                            <li><a href="https://help.github.com" data-ga-click="Footer, go to help, text:help">Help</a></li>

                                                          </ul>

                                                          <a href="https://github.com" aria-label="Homepage">
                                                            <span class="mega-octicon octicon-mark-github" title="GitHub"></span>
                                                          </a>
                                                          <ul class="site-footer-links">
                                                            <li>&copy; 2015 <span title="0.03949s from github-fe123-cp1-prd.iad.github.net">GitHub</span>, Inc.</li>
                                                            <li><a href="https://github.com/site/terms" data-ga-click="Footer, go to terms, text:terms">Terms</a></li>
                                                            <li><a href="https://github.com/site/privacy" data-ga-click="Footer, go to privacy, text:privacy">Privacy</a></li>
                                                            <li><a href="https://github.com/security" data-ga-click="Footer, go to security, text:security">Security</a></li>
                                                            <li><a href="https://github.com/contact" data-ga-click="Footer, go to contact, text:contact">Contact</a></li>
                                                          </ul>
                                                        </div>
                                                      </div>


                                                      <div class="fullscreen-overlay js-fullscreen-overlay" id="fullscreen_overlay">
                                                        <div class="fullscreen-container js-suggester-container">
                                                          <div class="textarea-wrap">
                                                            <textarea name="fullscreen-contents" id="fullscreen-contents" class="fullscreen-contents js-fullscreen-contents" placeholder="" aria-label=""></textarea>
                                                            <div class="suggester-container">
                                                              <div class="suggester fullscreen-suggester js-suggester js-navigation-container"></div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div class="fullscreen-sidebar">
                                                          <a href="#" class="exit-fullscreen js-exit-fullscreen tooltipped tooltipped-w" aria-label="Exit Zen Mode">
                                                            <span class="mega-octicon octicon-screen-normal"></span>
                                                          </a>
                                                          <a href="#" class="theme-switcher js-theme-switcher tooltipped tooltipped-w"
                                                            aria-label="Switch themes">
                                                            <span class="octicon octicon-color-mode"></span>
                                                          </a>
                                                        </div>
                                                      </div>






                                                      <div id="ajax-error-message" class="flash flash-error">
                                                        <span class="octicon octicon-alert"></span>
                                                        <a href="#" class="octicon octicon-x flash-close js-ajax-error-dismiss" aria-label="Dismiss error"></a>
                                                        Something went wrong with that request. Please try again.
                                                      </div>


                                                      <script crossorigin="anonymous" src="https://assets-cdn.github.com/assets/frameworks-eedcd4970c51d77d26b12825fc1fb1fbd554a880c0a8649a9cac6b63f1ee7cff.js"></script>
                                                      <script async="async" crossorigin="anonymous" src="https://assets-cdn.github.com/assets/github/index-1af8eb3fd83c34afcee37eae4704e57d3bb35ccacee5574545665527ae02d731.js"></script>


                                                    </body>
                                                  </html>

