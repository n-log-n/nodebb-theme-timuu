<div component="categories/category" data-cid="{../cid}" data-numRecentReplies="{../numRecentReplies}" class="col-md-3 kralahmet">
  <div class="kralahmet-container">
    <meta itemprop="name" content="{../name}">
    <div class="kralahmet-bg" style="{function.generateCategoryBackground}"></div>
    <div class="content sicakhavalar">
			<a class="div-href" href="{config.relative_path}/category/{../slug}" itemprop="url">
				<h2 class="title">
					<!-- IMPORT partials/categories/link.tpl --><br/>
					{* <!-- IF ../descriptionParsed -->
					<div class="description">
						{../descriptionParsed}
					</div>
					<!-- ENDIF ../descriptionParsed --> *}
				</h2>
				
				<div class="fixed-stats">
				<!-- IF !../link -->
					<div class="stats pull-left" style="color: #fff; font-size: 14px; margin-right: 15px;">
						<small style="color: #fff;"><i class="fa fa-rocket"></i></small>
						<span class="{../unread-class} evetya human-readable-number" title="{../totalTopicCount}">{../totalTopicCount}</span>
					</div>
					<div class="stats pull-left" style="color: #fff; font-size: 14px;">
						<small style="color: #fff;"><i class="fa fa-bolt"></i></small>
						<span class="{../unread-class} evetya human-readable-number" title="{../totalPostCount}">{../totalPostCount}</span>
					</div>
			</a>
		</div>
	</div>
	<!-- ENDIF !../link -->
</div></div>
