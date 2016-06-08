
function getSignedRequest(file){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/sign_s3?file_name='+file.name+'$&file_type='+file.type);
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            if(xhr.status ===200){
                var response = JSON.parse(xhr.responseText);
                upload_file(file, response.signed_request, response.url);
            }else{
                alert('Could not get signed URL.');
            }
        }
    };
    xhr.send();
}

function upload_file(file, signed_request, url){
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', signed_request);
    xhr.setRequestHeader('x-amz-acl', 'public-read');
    xhr.onload = function(){
        if (xhr.status === 200){
            document.getElementById('preview').src = url;
            document.getElementById('avatar_url').value = url;
        }
    };
    xhr.onerror = function() {
        alert('Could not upload file.');
    };
    xhr.send(file);
}

function init(){
    document.getElementById('file_input').onchange = function(){
        var files = this.files;
        var files = files[0];
        if (file == null){
            alert('No file selected');
        }else{
            get_signed_request(file);
        }
    }
}

document.addEventListener('DOMContentLoaded', init, 0);
