<div class="row">
    <div class="<!-- IF widgets.sidebar.length -->col-lg-9 col-sm-12<!-- ELSE -->col-lg-12<!-- ENDIF widgets.sidebar.length -->">
	<!-- Button trigger modal -->
	    <button type="button" class="btn btn-primary"  style="float: right;" data-toggle="modal" data-target="#exampleModal">
		  Add a New Movie
		</button>
		<!-- Modal -->
		<div class="modal fade modal-dialog-centered" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
		    <div class="modal-dialog modal-lg" role="document">
		        <div class="modal-content">
		            <div class="modal-header">
		                <h4 class="modal-title" id="exampleModalLabel">Add a Movie</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
		            </div>
		            <div class="modal-body">
		      	        <div class="row">
		      		        <div class="col-lg-12">
    					        <div class="input-group">
      						        <input id="movie_search" type="text" class="form-control" placeholder="Search for...">
      						        <span class="input-group-btn">
        						        <button id="movie_search_go" class="btn btn-default" type="button">Go!</button>
      						        </span>
    					        </div><!-- /input-group -->
  					        </div><!-- /.col-lg-6 -->
		      	        </div>
                        <div class="movie_search_class">
		      	        </div>
		            </div>
		            <div class="modal-footer">
		                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
		                <button type="button" class="btn btn-primary">Save changes</button>
		            </div>
		        </div>
		    </div>
		</div>
	</div>
</div>