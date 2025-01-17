import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { styled, keyframes } from 'styled-components';

import baseimage from '../../image/baseprofile.png';
import PetCategoryModal from '../register/modals/PetCategory';
import { useInput, maxLen, checkRegExp } from '../../utils/UseHook';
import dataURLtoFile from '../../utils/DataURL2File';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px 40%;
    flex-wrap: wrap;
    
    animation: ${fadeIn} 2s;
`;

const Title = styled.h1`
    display: inline-block;
    min-width: 800px;
    font-size: 30px;
    text-align: center;
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    width: 800px;

    padding: 40px;
    border-radius: 10px;
    background-color: white;
    text-align: center;

    box-shadow: 2px 3px 5px 0px;
`

const HeaderWrapper = styled(Wrapper)`
    position: relative;
    height: 500px;
`;

const BodyWrapper = styled.div`
    margin-top: 100px;
    margin-bottom: 100px;
    min-width: 800px;

    padding: 10px;
    border-radius: 10px;
    background-color: white;
    text-align: center;

    box-shadow: 2px 3px 5px 0px;
`;

const FooterWrapper = styled(Wrapper)`
    min-width: 800px;
`

const PetInfoWrapper = styled(HeaderWrapper)`
    width: 750px;
    height: 400px;
    padding: 20px;
`;

const ImageBox= styled.div`
    width: 300px;
    height: 250px;
    text-align: center;
`;

const Image = styled.img`
  width: 200px;
  height: 200px;
  border: 2px solid black;
  border-radius: 100px;
  margin-bottom: 30px;
`;

const InfoBox = styled.div`
    width: 400px;
    height: 400px;
    padding: 30px;
`

const CatogoryBtn = styled.button`
    width: 150px;
    height: 40px;
    border: none;
    border-radius: 10px;
    color: white;
    background-color: skyblue;
`

const Label = styled.label`
    display: inline-block;
    width: 100px;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
    font-weight: bold;
`;

const ImageBtnLabel = styled.label`
    width: 100px;
    height: 40px;
    border: none;
    border-radius: 10px;
    background-color: blueviolet;
    color: white;

    transition: scale 1s;
    &:hover {
        scale: 0.9;
    }
`

const InputBox = styled.input.attrs({required: true})`
    width: 200px;
    height: 40px;
    padding: 5px;
    margin: 5px;
    border: none;
    border-bottom: 2px solid black;
    font-size: 15px;

    &:focus {
        background-color: rgba(255, 207, 159, 0.4);
    }
`

const TextAreaBox = styled.textarea.attrs({required: true})`
    width: 300px;
    height: 200px;
    padding: 5px;
    margin: 5px;
    border-radius: 15px;
    font-size: 15px;
`

const AddBtn = styled.button`
    margin: 10px;
    width: 100px;
    height: 60px;
    border: none;
    border-radius: 10px;
    color: black;
    background-color: #cee0c2;

    transition: scale 1s, border 1s;
    &:active {
        scale: 0.95;
        border: 2px solid black;
    }
`

const RemoveBtn = styled.button`
    width: 80px;
    height: 40px;
    border: none;
    border-radius: 10px;
    color: black;
    background-color: #ffd1a7;

    transition: scale 1s, border 1s;
    &:active {
        scale: 0.95;
        border: 2px solid tomato;
    }
`

const AddPetInfoWrapper = styled.div`
    margin: 10px 20px;
    width: 750px;
    height: 400px;
    border: none;
    border-radius: 10px;
    box-shadow: 2px 3px 5px 0px;
    
`

const TextBox = styled.span`
    display: inline-block;
    height: 30px;
    margin: 5px 20px;
    color: black;
    font-size: 18px;
`

const CompleteBtn = styled.button`
    width: 120px;
    height: 40px;
    margin: 15px;
    border: none;
    border-radius: 10px;
    color: white;
    background-color: #b85c52;
`

const PassRegiBtn = styled.button`
    width: 120px;
    height: 40px;
    margin: 15px;
    border: none;
    border-radius: 10px;
    color: white;
    background-color: teal;
`
function PetUpdate() {
    const [ cookie ] = useCookies(["USER_ID"]);

    // 모달창
    const [ activeModal, setActiveModal ] = useState(false);

    // 입력값
    const [ petCategory, setPetCategory ] = useState("반려동물 선택");
    const [ imgFile, setImgFile ] = useState(baseimage);
    const petName = useInput("", checkRegExp, /^(?:[A-Za-zㄱ-ㅎ가-힣]{0,8}|)$/);
    const petBirth = useInput("", checkRegExp, /^[0-9]{0,8}$/);
    const petIntro = useInput("", maxLen, 100);
    const [ petGender, setPetGender] = useState("0");

    const nameRef = useRef();

    // 저장값
    const [ petInfoList, setPetInfoList ] = useState([]);
    const [ imageList, setImageList ] = useState([]);
    const imgRef = useRef();

    const navigate = useNavigate();

    // 트리거
    const [ count, setCount ] = useState(0);

    const imgLoad = () => {
        // File 객체 반환됨
        const file = imgRef.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file); // file을 url로 읽고
        reader.onloadend = () => { // 읽기가 끝나면
          setImgFile(reader.result); // reader 결과(이미지)를 img 태그에 설정
        }
    }

    const imgLoadFile = (fileObject) => {
        // File 객체 읽기
        const reader = new FileReader();
        reader.readAsDataURL(fileObject);
        reader.onloadend = () => {
            return reader.result;
        }
    }

    const addPetInfo = () => {
        // 입력값 체크
        if (!petCategory || petCategory === "반려동물 선택") {
            alert("카테고리가 선택되지 않았습니다.");
            return;
        }
        if (!petName.value) {
            alert("변려동물의 이름이 작성되지 않았습니다.");
            return;
        }
        if (!petBirth.value) {
            alert("반려동물의 생일이 작성되지 않았습니다.");
            return;
        }
        if (petBirth.value.length !== 8) {
            alert("생년월일 8글자를 입력해주세요.");
            return;
        }
        if (!petIntro.value) {
            alert("반려동물 소개를 입력해주세요!");
            return;
        }
        if (petGender === null) {
            alert("반려동물의 성별을 입력해주세요!");
            return;
        }
        const key = Math.random().toString(36).substring(2, 11); // 랜덤키 생성
        const petInfo = { key, data: { id: cookie.USER_ID, cate: petCategory, name: petName.value, birth: petBirth.value, intro: petIntro.value, gender: petGender} };
        const imageInfo = { key, data: imgRef.current.files[0]}
        setPetInfoList(petInfoList => petInfoList.concat(petInfo));
        setImageList(imageList => imageList.concat(imageInfo));
        setCount(prev => prev+1);
    }

    useEffect(()=>{
        // 초기화
        setPetCategory("반려동물 선택");
        petName.setValue("");
        petBirth.setValue("");
        petIntro.setValue("");
        setPetGender("");
        imgRef.current.value = "";
        setImgFile(baseimage);
    },[count])

    const removePetInfo = (event) => {
        const removedPetInfoList = petInfoList.filter((petInfo)=> petInfo.key !== event.target.dataset.key);
        const removedImageList = imageList.filter((image) => image.key !== event.target.dataset.key)
        setPetInfoList(removedPetInfoList);
        setImageList(removedImageList);
    }
    
    useEffect(()=>{
        if (!cookie.USER_ID) {
            alert("로그인 후 이용해주세요");
            navigate("/login");
            return;
        }
        const getPetInfoList = async() => {
            await axios.post("http://localhost:3000/get/petInfo", null, {params: { id: cookie.USER_ID }})
            .then((response)=> {
                if (response.status === 200) {
                    // 랜덤키 생성하여 고유인덱스 키 사용.
                    if (response.data.length === 0) {
                        alert("등록한 펫정보가 없습니다.");
                        return;
                    }
                    console.log(response.data);
                    for(let i=0; i<response.data.petInfoList.length; i++) {
                        let key = Math.random().toString(36).substring(2, 11);
                        let petInfoJson = { key, data: response.data.petInfoList[i] };
                        let imageInfoJson = { key, data: response.data.imageList[i] };

                        setPetInfoList(petInfoList => petInfoList.concat(petInfoJson));
                        setImageList(imageList => imageList.concat(imageInfoJson));
                    }
                }
            })
        }
        getPetInfoList();
    },[])

    const updatePetInfo = async() => {
        if(petInfoList.length === 0){
            alert("반려동물의 정보가 입력되지 않았습니다.");
            return;
        }
        const petInfoData = petInfoList.map((items) => items.data);
        // 이미지가 base64 냐 File 이냐에 따라 달라짐.
        const imageData = imageList.map((items) => items.data);
        
        let formData = new FormData();
        formData.append("petInfoList", new Blob([JSON.stringify(petInfoData)], {type: "application/json"}))
        imageData.map((image, index)=>{
            if (typeof image == "object") {
                formData.append("file", image);
            }else{
                let file = dataURLtoFile(`data:image/jpeg;base64,${image}`, `image${index}`);
                formData.append("file", file)
            }
        })
        
        formData.append("id", cookie.USER_ID);

        await axios.post("http://localhost:3000/update/petInfo", formData, {"Content-Type": `multipart/form-data`})
        .then((response)=> {
            if (response.status === 200){
                if (response.data === "YES") {
                    alert("반려동물 등록이 완료되었습니다!.");
                    navigate(`/myfeed/myfeed`);
                    return;
                }
                else {
                    alert("반려동물 등록에 실패하였습니다");
                    return;
                };
            }
            alert("에러코드 :",response.status);
        });
    }

    const cancelUpdateBtn = () => {
        navigate("/myfeed");
        return;
    }
    

    return(
        <Container>
        <Title>대표 반려동물 추가하기</Title>
        <HeaderWrapper>
            {activeModal ? <PetCategoryModal getPetCategory={setPetCategory} getModalActive={setActiveModal}/> : null}
            <ImageBox>
                <Image src={imgFile} alt="" /><br/>
                <ImageBtnLabel>이미지 추가
                    <input type="file" ref={imgRef} onChange={imgLoad} style={{width: "0px", height: "0px"}}/>
                </ImageBtnLabel>
                <br/><AddBtn onClick={addPetInfo}>반려동물<br/>추가하기</AddBtn>
            </ImageBox>
            <InfoBox>
                <Label>반려동물</Label><CatogoryBtn onClick={()=>setActiveModal(true)}>{petCategory}</CatogoryBtn><br/>
                <Label>반려동물 이름</Label><InputBox {...petName} ref={nameRef} placeholder="이름을 입력하세요(1~10 글자(영문/한글)" /><br/>
                <Label>반려동물 생일</Label><InputBox {...petBirth} placeholder="생년월일 8자리를 입력해주세요" /><br/>
                <div>
                    <Label>성별</Label>
                    <Label><input type="radio" onChange={()=>setPetGender(0)} name="petGender" />남아</Label>
                    <Label><input type="radio" onChange={()=>setPetGender(1)} name="petGender" />여아</Label>
                </div>
                <TextAreaBox {...petIntro} rows="10" maxLength="100" placeholder="100자 이내로 소개해주세요" ></TextAreaBox>
            </InfoBox>
        </HeaderWrapper>

        <BodyWrapper>
            <h2>추가한 반려동물 정보</h2><br/>
            <ul>
            {petInfoList.map((petInfo, index)=>
                <li key={index}>
                    <AddPetInfoWrapper>
                        <PetInfoWrapper>
                            <ImageBox>
                                { 
                                typeof imageList[index].data === "object" ?
                                <Image src={URL.createObjectURL(imageList[index].data)} />
                                :
                                <Image src={`data:image/jpeg;base64,${imageList[index].data}`} />
                                }
                                <br/><RemoveBtn data-key={petInfo.key} onClick={removePetInfo}>정보삭제</RemoveBtn>
                            </ImageBox>
                            <InfoBox>
                                <Label>반려동물</Label><TextBox>{petInfo.data.cate}</TextBox><br/>
                                <Label>반려동물 이름</Label><TextBox>{petInfo.data.name}</TextBox><br/>
                                <Label>반려동물 생일</Label><TextBox>{petInfo.data.birth}</TextBox><br/>
                                <Label>성별</Label><TextBox>{petInfo.data.gender === 0 ? "남자" : "여자"}</TextBox><br/>
                                <TextBox>{`${petInfo.data.intro.substring(1,20)}`}</TextBox><br/>
                            </InfoBox>
                        </PetInfoWrapper>
                    </AddPetInfoWrapper>
                </li>)}
            </ul>
        </BodyWrapper>

        <FooterWrapper>
                <CompleteBtn onClick={updatePetInfo}>수정하기</CompleteBtn>
                <PassRegiBtn onClick={cancelUpdateBtn}>돌아가기</PassRegiBtn>
        </FooterWrapper>
    </Container>
    );
}

export default PetUpdate;
