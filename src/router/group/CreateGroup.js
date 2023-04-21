/**
 * 그룹 생성 화면
 * @Auth 해운
 */

import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateGroup() {

    let history = useNavigate();

    // const json = JSON.parse(localStorage.getItem("login"));

    // 그룹 생성 시, 입력할 사항
    const [grpName, setGrpName] = useState('');
    const [grpLeader, setGrpLeader] = useState('');
    const [grpImage, setGrpImage] = useState('');
    const [grpIntro, setGrpIntro] = useState('');

    useEffect(()=>{
        // setGrpLeader(json.id);
        setGrpLeader('test2');
    },[]);

    const submitBtn = (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append("grpName", grpName);
        formData.append("grpLeader", grpLeader);
        formData.append("uploadFile", document.frm.uploadFile.files[0]);
        formData.append("grpIntro", grpIntro);

        axios.post("http://localhost:3000/group/createGroup", formData)
        .then(function(res) {
            alert('그룹 생성 성공');
            history("/group/NewsFeed");
        })
        .catch(function(err) {
            alert("에러");
        })
    }

    return (
        <>
        <form name="frm" onSubmit={submitBtn} encType="multipart/form-data">
        <h3>그룹 생성하기</h3>
            <label htmlFor="GRP_NAME">그룹명 : </label>
            <br />
            <input type="text" name="grpName" onChange={(e)=>setGrpName(e.target.value)} />
            <br />
            <label htmlFor="GRP_IMAGE">그룹 대표 이미지 : </label>
            <br />
            <input type="file" name="uploadFile" onChange={(e)=>setGrpImage(e.target.value)} accept='*' />
            <br />
            <label htmlFor="GRP_IMAGE">그룹 소개 : </label>
            <br />
            <textarea cols="80" rows="5" name="grpIntro" onChange={(e)=>setGrpIntro(e.target.value)} />
            <input type="submit" value="그룹 생성하기" />
        </form>
        </>
    )
}