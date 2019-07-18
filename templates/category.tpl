<!-- IMPORT partials/breadcrumbs.tpl -->
<div widget-area="header">
	<!-- BEGIN widgets.header -->
	{{widgets.header.html}}
	<!-- END widgets.header -->
</div>
<!-- IF header -->
<div class="card">
	<div class="container-fliud">
		<div class="wrapper row">
            <div class="preview col-md-4">
                <div class="preview-pic tab-content">
                    <div class="tab-pane active" id="pic-1"><img class="img-responsive" src="{backgroundImage}" /></div>
                </div>
            </div>
            <div class="details col-md-8">
                <h1 class="product-title">{{name}}</h1>
                <p class="product-description">{{../description}}</p>
                <div class="action">
                    <button component="category/post" id="new_topic" class="btn btn-primary">Create a New Topic</button>
                    <button id="discussions-btn" class="btn btn-default" type="button">View {{topic_count}} Discussions</button>
                </div>
				<h2 class="lead">               
				This page is dedicated to discussions around <b>{{name}}</b>. You can watch trailers, read frequently asked questions and immerse yourself in trivia related to {{name}}.
				</h2>
            </div>
        </div>
    </div>
</div>
<br>

<!-- ENDIF header -->
<div class="row">
	<div class="category <!-- IF widgets.sidebar.length -->col-lg-9 col-sm-12<!-- ELSE -->col-lg-12<!-- ENDIF widgets.sidebar.length -->">
		<!-- IMPORT partials/category/subcategory.tpl -->

		<!-- IF children.length --><hr class="hidden-xs"/><!-- ENDIF children.length -->

		<div class="clearfix">
			<!-- IF privileges.topics:create -->
			<button component="category/post" id="new_topic" class="btn btn-primary">[[category:new_topic_button]]</button>
			<!-- ELSE -->
				<!-- IF !loggedIn -->
				<a component="category/post/guest" href="{config.relative_path}/login" class="btn btn-primary">[[category:guest-login-post]]</a>
				<!-- ENDIF !loggedIn -->
			<!-- ENDIF privileges.topics:create -->

			<span class="pull-right" component="category/controls">
				<!-- IMPORT partials/category/watch.tpl -->
				<!-- IMPORT partials/category/sort.tpl -->
				<!-- IMPORT partials/category/tools.tpl -->
			</span>
		</div>

		<hr class="hidden-xs" />

		<p class="hidden-xs">{name}</p>

		<!-- IF !topics.length -->
		<div class="alert alert-warning" id="category-no-topics">
			[[category:no_topics]]
		</div>
		<!-- ENDIF !topics.length -->

		<!-- IMPORT partials/topics_list.tpl -->

		<!-- IF config.usePagination -->
			<!-- IMPORT partials/paginator.tpl -->
		<!-- ENDIF config.usePagination -->
	</div>
	<div widget-area="sidebar" class="col-lg-3 col-sm-12 <!-- IF !widgets.sidebar.length -->hidden<!-- ENDIF !widgets.sidebar.length -->">
		<!-- BEGIN widgets.sidebar -->
		{{widgets.sidebar.html}}
		<!-- END widgets.sidebar -->
	</div>
</div>
<div widget-area="footer">
	<!-- BEGIN widgets.footer -->
	{{widgets.footer.html}}
	<!-- END widgets.footer -->
</div>

<!-- IMPORT partials/move_thread_modal.tpl -->

<!-- IF !config.usePagination -->
<noscript>
	<!-- IMPORT partials/paginator.tpl -->
</noscript>
<!-- ENDIF !config.usePagination -->
