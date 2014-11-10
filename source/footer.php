            </div>
        </div>
<?php
    $xhr = strpos($_SERVER['REQUEST_URI'], '?xhr=true') !== FALSE;

    if (!$xhr) :
?>
        <script src="inc/script/lib/require/require.js" data-main="inc/script/app/Bootstrap"></script>

    </body>
</html>
<?php
    endif;