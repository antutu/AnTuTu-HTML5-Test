function setViewport(canvas_width) {
    try {
		if(window.location.href.indexOf("?inner=1") > 0)
			return;

        var scale = 1.0;
        if (canvas_width > 0)
            scale = window.innerWidth / canvas_width;
        var viewport = document.getElementById("viewport");
        viewport.content = "width=device-width,initial-scale=" + scale.toFixed(3) + ",minimum-scale=0.1,maximum-scale=2.0,user-scalable=no";
    } catch (err) {
    }
}
