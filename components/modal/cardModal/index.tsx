import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import clsx from "clsx";
import ModalContainer from "../ModalContainer";
import ModalPortal from "../ModalPortal";
import BaseButton from "@/components/button/baseButton/BaseButton";
import { putComments, deleteComments, getComments } from "@/api/comments";
import { CardPropsType } from "@/types/cards";
import { Comment, CommentContent } from "@/types/comments";
import { Time } from "@/utils/time";
import { generateRandomColorHexCode } from "@/utils/color";
import { COLORS } from "@/constants/colors";
import styles from "./CardModale.module.scss";
import axios from "@/lib/axios";
import TagChips from "@/components/chips/TagChips";

interface CardModalProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  cardProps: CardPropsType;
  title: string;
}

interface CommentForm {
  comment: string;
}

interface Colors {
  GREEN: string;
  PURPLE: string;
  ORANGE: string;
  BLUE: string;
  PINK: string;
}

const CardModal = ({ setIsOpen, cardProps, title }: CardModalProps) => {
  const { register, handleSubmit, reset } = useForm<CommentForm>({
    mode: "onBlur",
  });
  const currentCardId = Number(cardProps.id);
  const [isComment, setIsComment] = useState<Comment>();
  const [kebabOpen, setKebabOpen] = useState<boolean>(false);

  const handleKebab = () => {
    setKebabOpen((prevKebabOpen) => !prevKebabOpen);
  }

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post("/comments", {
        content: data.comment,
        cardId: cardProps.id,
        columnId: cardProps.columnId,
        dashboardId: cardProps.dashboardId,
      });
      getCommentData(10, currentCardId);
      reset();
    } catch (error) {
      console.error("댓글 작성 실패", error);
    }
  };

  const getCommentData = async (size: number, cardId: number) => {
    try {
      const response = await getComments(10, cardId);
      setIsComment(response);
    } catch (error) {
      console.error("댓글 불러오기 실패", error);
    }
  };
  const putCommentData = async (commentId: number) => {
    try {
      await putComments(commentId);
      getCommentData(10, currentCardId);
    } catch (error) {
      console.error("댓글 수정 실패");
    }
  };

  const deleteCommentData = async (commentId: number) => {
    try {
      await deleteComments(commentId);
      getCommentData(10, currentCardId);
    } catch (error) {
      console.error("댓글 삭제 실패");
    }
  };

  useEffect(() => {
    getCommentData(10, currentCardId);
  }, [currentCardId]);

  const getRandomColor = (): string => {
    const colorKeys: (keyof Colors)[] = Object.keys(COLORS) as (keyof Colors)[];
    const randomIndex = Math.floor(Math.random() * colorKeys.length);
    const selectedColorKey = colorKeys[randomIndex];
    return COLORS[selectedColorKey];
  };

  return (
    <ModalPortal>
      <ModalContainer setIsOpen={setIsOpen}>
        <div className={clsx(styles.modalWrapper)}>
          <div>
            <div className={clsx(styles.titleWrapper)}>
              <h1>{cardProps.title}</h1>
              <div className={clsx(styles.buttonWrapper)}>
                <Image
                  src="/icons/moreButton.svg"
                  alt="케밥 버튼"
                  width={32}
                  height={32}
                  onClick={handleKebab}
                />
                <Image
                  src="/icons/close.svg"
                  alt="닫기 버튼"
                  width={20}
                  height={20}
                />
              </div>
              {kebabOpen && <div className={clsx(styles.kebabModal)}>
                <div className={clsx(styles.kebabItem)}>수정하기</div>
                <div className={clsx(styles.kebabItem)}>삭제하기</div>
              </div>}
            </div>
            <div className={clsx(styles.tagWrapper)}>
              <div className={clsx(styles.columnTitle)}>•{title}</div>
              <div className={clsx(styles.divide)}></div>
              <div className={clsx(styles.tags)}>
                {cardProps.tags.map((tag, index) => (
                  <TagChips
                    key={`tags_${index}`}
                    tagName={tag}
                    color={generateRandomColorHexCode()}
                  />
                ))}
              </div>
            </div>
            <div className={clsx(styles.description)}>
              {cardProps.description}
            </div>
            <Image
              className={clsx(styles.cardImg)}
              src={`${cardProps.imageUrl}`}
              alt="카드 이미지"
              width={450}
              height={263}
            />
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={clsx(styles.commentForm)}
            >
              <label>댓글</label>
              <input
                type="text"
                placeholder="댓글 작성하기"
                {...register("comment")}
              />
              <div className={clsx(styles.submitButton)}>
                <BaseButton type="submit" comment white>
                  입력
                </BaseButton>
              </div>
            </form>
            <div>
              {isComment?.comments.map((comment: CommentContent) => (
                <div key={comment.id}>
                  <div
                    style={{
                      backgroundImage: comment.author.profileImageUrl
                        ? `url(${comment.author.profileImageUrl})`
                        : "none",
                      backgroundColor: getRandomColor(),
                    }}
                  >
                    {comment.author.nickname.charAt(0).toUpperCase()}
                  </div>
                  <div>{comment.author.nickname}</div>
                  <div>{Time(`${comment.updatedAt}`)}</div>
                  <div>{comment.content}</div>
                  <div>수정</div>
                  <div onClick={() => deleteCommentData(comment.id)}>삭제</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div>
              <span>담당자</span>
              <div>
                <div
                  key={cardProps.assignee.id}
                  className={clsx(styles.invitee)}
                  style={{
                    backgroundImage: cardProps.assignee.profileImageUrl
                      ? `url(${cardProps.assignee.profileImageUrl})`
                      : "none",
                    backgroundColor: getRandomColor(),
                  }}
                >
                  {cardProps.assignee.nickname.charAt(0).toUpperCase()}
                </div>
                <div className={clsx(styles.user)}>
                  {cardProps.assignee.nickname}
                </div>
              </div>
            </div>
            <div>
              <span>마감일</span>
              <span>{Time(`${cardProps.dueDate}`)}</span>
            </div>
          </div>
        </div>
      </ModalContainer>
    </ModalPortal>
  );
};

export default CardModal;
