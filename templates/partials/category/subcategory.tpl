<!-- IF loggedIn -->
<!-- IMPORT partials/search_movies.tpl -->
<!-- ELSE -->
<div class="row">
    <div class="<!-- IF widgets.sidebar.length -->col-lg-9 col-sm-12<!-- ELSE -->col-lg-12<!-- ENDIF widgets.sidebar.length -->">
      <a href="{config.relative_path}/login"><button type="button" class="btn btn-primary"  style="float: right;" >
          Add a New Movie
      </button></a>
    </div>
</div>
<!-- ENDIF loggedIn -->

<div class="subcategory">
	<!-- IF children.length --><p>[[category:subcategories]]</p><!-- ENDIF children.length -->

	<ul class="categories" itemscope itemtype="http://www.schema.org/ItemList">
    <div class="row">
      <!-- BEGIN children -->
      <!-- IMPORT partials/categories/item-sub.tpl -->
      <!-- END children -->
    </div>
	</ul>
</div>
