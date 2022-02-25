import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

import { scrollToElement } from '../helpers';

export default class About extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		window.onload = () => {
			scrollToElement('about-wrapper');
		}
	}

	render() {
		return (
			<section className="ftco-section ftco-degree-bg" id="about-wrapper">
				<Helmet>
					<title>Lời chào thương mến, từ ba mẹ của Silly~</title>
				</Helmet>
				<div className="container">
					<div className="row">
						<div className="col-lg-12 ftco-animate fadeInUp ftco-animated" style={{ fontSize: '18pt', color: 'black', fontFamily: 'iCiel Altus' }}>
							<p style={{ fontWeight: 1000 }}><em>Lời chào thương mến, từ ba mẹ của Silly~</em></p>
							<p>&nbsp;</p>
							<p>Hôm nay là một ngày rất giản đơn, nhưng đủ yên bình để bắt tay viết vài dòng như vậy.</p>
							<p>---</p>
							<p>Cũng khá lâu rồi, khi tụi mình bắt đầu ý định tìm một chốn chung cho cả hai.
							Một dự định kéo dài quá lâu sẽ nhanh nản, một ý tưởng hay ho nhưng hời hợt rồi cũng chóng quên.</p>
							<p>Mà may thay, khi một trong hai là người đủ kiên nhẫn và nhớ lâu để chầm chậm, nhẹ nhàng xây từng viên gạch cho ngôi nhà be bé.&nbsp;</p>
							<p><span style={{ textDecoration: 'line-through' }}>(Và tất nhiên, người đó hỏng phải cái đứa đang lọc cọc gõ các dòng này)</span></p>
							<p>---</p>
							<p>Một chốn nhỏ xinh xắn ghi giữ một phần những chuyện vụn vẹn của cuộc đời. Một chốn nhỏ an yên để viết lên những tâm tư thương mến. Một chốn nhỏ nhưng đầy mọi hỉ nộ ái sầu chuyện yêu đương, chuyện con người.</p>
							<p>&nbsp;</p>
							<p><span style={{ color: 'rgb(255, 102, 0)' }}><em>Chuyện chúng mình</em></span>,
							được gửi gắm trong ngăn <span style={{ color: 'rgb(255, 102, 0)', fontSize: '22pt', fontWeight: 1000 }}>Our diary</span>,
							với những chuyến đi, những câu chuyện kể, hay bữa ăn ngon, và lắm thứ couple.</p>
							<p>Còn có <span style={{ color: 'rgb(118, 165, 175)' }}>Khoảng yên lành</span>&nbsp;
								<span style={{ color: 'rgb(162, 196, 201)', fontSize: '22pt', fontWeight: 1000 }}>
									Self story
								</span>,
								mỗi đứa dành riêng cho niềm yêu của bản thân mình vậy. Vì bạn biết đấy, dù thế nào, bọn mình vẫn phải là một&nbsp;
							<span style={{ color: 'rgb(164, 194, 244)', fontSize: '22pt', fontWeight: 1000 }}>Yên</span>
								&nbsp;và&nbsp;
								<span style={{ color: 'rgb(0, 255, 0)', fontSize: '22pt', fontWeight: 1000 }}>Hy</span>
								&nbsp;- đâu thể cứ giống nhau…&nbsp;</p>
							<p><br /><br /></p>
							<p>Sillything là thế, là đứa trẻ ngô nghê của hai đứa đang chập chững học yêu…</p>
							<p><em>“Two silly persons, some silly things, many silly moments, with one silly love”</em></p>
							<p>&nbsp;</p>
							<p>Best time, enjoy our words!</p>
							<p>02022020</p>
						</div>
					</div>
				</div>
			</section>
		);
	}

}
